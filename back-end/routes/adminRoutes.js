const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const adminUsers = require("../controllers/adminUsersController");
const adminModeration = require("../controllers/adminModerationController");
const adminFinance = require("../controllers/adminFinanceController");
const adminStats = require("../controllers/adminStatsController");

const User = require("../model/userSchema");

// ====== Protect all routes: Admin only ======
router.use(protect, authorizeRoles("admin"));

// ====== Users & Mentors Management ======
router.get("/users", adminUsers.getUsers);               // List all users
router.get("/users/:id", adminUsers.getUserById);        // Get single user
router.post("/users", adminUsers.createUser);            // Create new user manually
router.put("/users/:id", adminUsers.updateUser);         // Update user
router.delete("/users/:id", adminUsers.deleteUser);      // Delete user

// ====== Dashboard Stats ======
router.get("/dashboard-stats", adminStats.getDashboardStats);

// ====== Pending Mentors (Admin Review Section) ======
router.get("/pending-mentors", adminUsers.getPendingMentors);

// ====== Approve / Reject Mentor ======
router.put("/approve-mentor/:id", adminUsers.approveMentor);  // Approve mentor
router.put("/reject-mentor/:id", adminUsers.rejectMentor);    // Reject mentor

// ====== Content Moderation ======
router.get("/reported-posts", adminModeration.getReportedPosts);           // Get all reported posts
router.put("/reports/:reportId/review", adminModeration.reviewReport);     // Review/dismiss a single report
router.delete("/posts/:postId/remove", adminModeration.removeReportedPost); // Remove a post
router.put("/posts/:postId/dismiss-reports", adminModeration.dismissReports); // Dismiss all reports for a post

// ====== Payments & Revenue ======
router.get("/revenue-stats", adminFinance.getRevenueStats);            // Get revenue statistics
router.get("/transactions", adminFinance.getTransactions);             // Get all transactions

module.exports = router;
