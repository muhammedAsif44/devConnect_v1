const Session = require("../models/sessionSchema");
const User = require("../models/userSchema");

exports.submitFeedback = async (req, res) => {
  try {
    const { sessionId, rating, review } = req.body;
    const developerId = req.user._id;

    // Validate session
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "completed")
      return res.status(400).json({ message: "Feedback only after completion" });

    if (session.developerId.toString() !== developerId.toString())
      return res.status(403).json({ message: "Not authorized for this session" });

    const mentor = await User.findById(session.mentorId);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    // Prevent duplicate feedback
    const alreadyGiven = mentor.mentorRating.reviews.some(
      (r) => r.sessionId.toString() === sessionId.toString()
    );
    if (alreadyGiven)
      return res.status(400).json({ message: "Feedback already submitted" });

    // Add new review
    mentor.mentorRating.reviews.push({
      developerId,
      sessionId,
      rating,
      review,
    });

    // Recalculate average
    const totalReviews = mentor.mentorRating.reviews.length;
    const totalRating = mentor.mentorRating.reviews.reduce(
      (sum, r) => sum + r.rating,
      0
    );
    mentor.mentorRating.average = totalRating / totalReviews;
    mentor.mentorRating.totalReviews = totalReviews;

    await mentor.save();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
