const express = require("express");
const router = express.Router();
const { getAllShows, bookSeats } = require("../controllers/userController");

router.get("/shows", getAllShows);
router.post("/book", bookSeats);

module.exports = router;
