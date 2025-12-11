const pool = require("../db");

exports.createShow = async (req, res) => {
  const { name, start_time, total_seats } = req.body;

  if (!name || !start_time || !total_seats || total_seats <= 0) {
    return res
      .status(400)
      .json({ error: "All fields are required and must be valid" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO shows (name, start_time, total_seats) VALUES ($1, $2, $3) RETURNING *`,
      [name, start_time, total_seats]
    );

    res.status(201).json({
      message: "Show created successfully",
      show: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating show:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
