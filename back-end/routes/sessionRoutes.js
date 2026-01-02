// const express = require("express");
// const { bookSession, getUserSessions, completeSession, cancelSession } = require("../controllers/sessionController");
// const { protect, authorizeRoles } = require("../middlewares/authMiddleware");

// const router = express.Router();

// // Booking session requires login & role
// router.post("/", protect, authorizeRoles("mentor", "developer"), bookSession);

// // Get sessions for a user - ensure only owner/admin/mentor can access
// router.get("/:userId", protect, (req, res, next) => {
//   const loggedInUserId = req.user._id.toString();
//   const requestUserId = req.params.userId ? req.params.userId.toString() : null;

//   if (!requestUserId) {
//     return res.status(400).json({ message: "User ID parameter is required." });
//   }

//   if (req.user.role !== "admin" && loggedInUserId !== requestUserId) {
//     return res.status(403).json({ message: "Forbidden: unauthorized" });
//   }

//   next();
// }, getUserSessions);

// // Mentor completes a session
// router.patch("/:sessionId/complete", protect, completeSession);

// // Mentor cancels a session
// router.patch("/:sessionId/cancel", protect, cancelSession);

// module.exports = router;

const express = require("express");
const {
  bookSession,
  getUserSessions,
  completeSession,
  cancelSession,
} = require("../controllers/sessionController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const { requirePremium } = require("../middlewares/premiumMiddleware"); // ✅ FIXED: destructure the function
const router = express.Router();

// ✅ Booking session requires login, role & premium access
router.post("/", protect, authorizeRoles("mentor", "developer"), requirePremium, bookSession);

// ✅ Get sessions for a user (MyBookings) — requires login + premium
router.get(
  "/:userId",
  protect,
  requirePremium,  
  (req, res, next) => {
    const loggedInUserId = req.user._id.toString();
    const requestUserId = req.params.userId ? req.params.userId.toString() : null;

    if (!requestUserId) {
      return res.status(400).json({ message: "User ID parameter is required." });
    }

    // ❗ Only admin or self can fetch their sessions
    if (req.user.role !== "admin" && loggedInUserId !== requestUserId) {
      return res.status(403).json({ message: "Forbidden: unauthorized" });
    }

    next();
  },
  getUserSessions
);

//   Mentor completes a session
router.patch("/:sessionId/complete", protect, completeSession);

//   Mentor cancels a session
router.patch("/:sessionId/cancel", protect, cancelSession);

module.exports = router;

