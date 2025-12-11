const pool = require("../db");

// GET /shows
exports.getAllShows = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        start_time,
        total_seats,
        (total_seats - booked_seats) AS available_seats
      FROM shows 
      ORDER BY start_time ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.log("Error Fetching Data : ", err);
    res.status(500).json({ error: "Internal Server Error " });
  }
};

// POST /book
exports.bookSeats = async (req, res) => {
  const { show_id, seat_count } = req.body;

  if (!show_id || !seat_count || seat_count <= 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const showResult = await client.query(
      `SELECT * FROM shows WHERE id = $1 FOR UPDATE`,
      [show_id]
    );

    if (showResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Show not found" });
    }

    const show = showResult.rows[0];
    const availableSeats = show.total_seats - show.booked_seats;

    // Create booking with PENDING status first
    const insertBooking = await client.query(
      `INSERT INTO bookings (show_id, seat_count, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [show_id, seat_count, "PENDING"]
    );

    if (availableSeats >= seat_count) {
      await client.query(
        `UPDATE shows SET booked_seats = booked_seats + $1 WHERE id = $2`,
        [seat_count, show_id]
      );

      await client.query(
        `UPDATE bookings SET status = 'CONFIRMED' WHERE id = $1`,
        [insertBooking.rows[0].id]
      );
    } else {
      await client.query(
        `UPDATE bookings SET status = 'FAILED' WHERE id = $1`,
        [insertBooking.rows[0].id]
      );
    }

    await client.query("COMMIT");

    // Get the updated booking
    const updatedBooking = await client.query(
      `SELECT * FROM bookings WHERE id = $1`,
      [insertBooking.rows[0].id]
    );

    return res.status(200).json({
      message: `Booking ${updatedBooking.rows[0].status}`,
      booking: updatedBooking.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Booking Error:", err);
    res.status(500).json({ error: "Booking failed" });
  } finally {
    client.release();
  }
};

// Function to check and update expired bookings
exports.checkExpiredBookings = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Find and update expired PENDING bookings
    const result = await client.query(
      `UPDATE bookings 
       SET status = 'FAILED'
       WHERE status = 'PENDING' 
       AND created_at < NOW() - INTERVAL '2 minutes'
       RETURNING *`
    );

    // If any bookings were expired, update the show's booked_seats
    if (result.rowCount > 0) {
      for (const booking of result.rows) {
        await client.query(
          `UPDATE shows 
           SET booked_seats = booked_seats - $1 
           WHERE id = $2`,
          [booking.seat_count, booking.show_id]
        );
      }
    }

    await client.query("COMMIT");
    return result.rows;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error checking expired bookings:", err);
    throw err;
  } finally {
    client.release();
  }
};
