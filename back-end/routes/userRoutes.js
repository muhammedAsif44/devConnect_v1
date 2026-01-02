const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");

// All routes require authentication
router.use(protect);

// Search/Filter Users (for finding mentors/developers)
router.get("/search", userController.searchUsers);

// Get User Profile
router.get("/:userId/profile", userController.getUserProfile);

// Update User Profile (self or admin)
router.put("/:id", userController.updateUserProfile);

// Upload Profile Photo
router.post(
  "/profile-photo",
  uploadMiddleware.single("profilePhoto"),
  userController.uploadProfilePhoto
);

module.exports = router;