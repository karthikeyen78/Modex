const { checkExpiredBookings } = require("../controllers/userController");

// Run the check every minute
const CHECK_INTERVAL = 60 * 1000; // 1 minute in milliseconds

async function startBookingExpiryJob() {
  console.log("Starting booking expiry job...");

  // Run immediately on startup
  try {
    const expiredBookings = await checkExpiredBookings();
    if (expiredBookings.length > 0) {
      console.log(`Processed ${expiredBookings.length} expired bookings`);
    }
  } catch (error) {
    console.error("Error in booking expiry job:", error);
  }

  // Then run every minute
  setInterval(async () => {
    try {
      const expiredBookings = await checkExpiredBookings();
      if (expiredBookings.length > 0) {
        console.log(`Processed ${expiredBookings.length} expired bookings`);
      }
    } catch (error) {
      console.error("Error in booking expiry job:", error);
    }
  }, CHECK_INTERVAL);
}

module.exports = { startBookingExpiryJob };
