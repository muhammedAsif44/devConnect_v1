const express = require("express");
const router = express.Router();
const { sendMailController } = require("../controllers/mailController");
const { protect } = require("../middlewares/authMiddleware");

// Send mail - Protected route
router.post("/", protect, sendMailController);

module.exports = router;