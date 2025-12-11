const express = require("express");
const app = express();
const cors = require('cors'); // Added CORS
app.use(cors()); // Enable CORS for all routes
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const { startBookingExpiryJob } = require("./jobs/bookingExpiry");

app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Start the booking expiry job
  startBookingExpiryJob();
});
