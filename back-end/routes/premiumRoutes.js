const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  getPlans,
  createOrder,
  verifyPayment,
} = require("../controllers/premiumController");

// ===== PUBLIC ROUTES =====
// Anyone can see plans (no auth needed)
router.get("/plans", getPlans);

// ===== PROTECTED ROUTES =====
// User must be logged in (protect middleware adds req.user)
router.post("/create-order/:planId", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);

module.exports = router;
