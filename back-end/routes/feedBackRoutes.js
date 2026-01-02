const express = require("express");
const { submitFeedback } = require("../controllers/feedbackController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, submitFeedback);

module.exports = router;
