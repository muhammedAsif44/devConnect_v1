const express = require("express");
const { getMentors,getMentorRatings, getAllMentors } = require("../controllers/mentorController");
const { protect, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

// Protect route to only authenticated users
router.get("/", protect, authorizeRoles("admin", "mentor", "developer"), getMentors);

router.get('/:id/ratings', protect, getMentorRatings);
router.get("/all",getAllMentors)


module.exports = router;
