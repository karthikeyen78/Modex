const express = require("express");
const router = express.Router();
const { createShow } = require("../controllers/adminController");

router.post("/show", createShow);

module.exports = router;
