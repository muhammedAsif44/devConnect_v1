const Session = require("../model/sessionSchema");
const User = require("../model/userSchema");
const { sendSessionBookedMenteeNotification, sendSessionBookedMentorNotification } = require("../services/emailService");

// Book a mentorship session
exports.bookSession = async (req, res) => {
  try {
    const { mentorId, menteeId, availabilityId, sessionType, slot, date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required (YYYY-MM-DD)" });
    }

    // Check if slot already booked for this date
    const existingSession = await Session.findOne({ mentorId, slot, date, status: "scheduled" });
    if (existingSession) {
      return res.status(409).json({ message: `Slot already booked for ${date} at ${slot}` });
    }

    const session = new Session({
      mentorId,
      menteeId,
      availabilityId,
      sessionType,
      slot,
      date,
      status: "scheduled",
    });

    await session.save();
    
    // Get mentor and mentee details
    const [mentor, mentee] = await Promise.all([
      User.findById(mentorId).select("name email"),
      User.findById(menteeId).select("name email")
    ]);

    // Send email notifications
    if (mentor && mentee) {
      // Send notification to mentee
      await sendSessionBookedMenteeNotification(mentee, mentor, session);
      
      // Send notification to mentor
      await sendSessionBookedMentorNotification(mentee, mentor, session);
    }

    // Mark slot as booked in mentor availability as well
    try {
      await User.updateOne(
        { _id: mentorId },
        {
          $set: {
            "mentorProfile.availability.$[day].slots.$[slot].isBooked": true,
            "mentorProfile.availability.$[day].slots.$[slot].bookedBy": menteeId,
          },
        },
        {
          arrayFilters: [
            { "day._id": availabilityId },
            { "slot.time": slot },
          ],
        }
      );
    } catch (e) {
      // Non-fatal: availability is also derived in GET /mentors
      console.warn("Availability update failed:", e.message);
    }
    res.status(201).json({ success: true, session });
  } catch (error) {
    console.error("Booking session error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user sessions for mentor or mentee
exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.params.userId;
    const sessions = await Session.find({
      $or: [{ mentorId: userId }, { menteeId: userId }],
    })
      .populate({
        path: "mentorId",
        select: "name profilePhoto mentorProfile skills",
        populate: [
          { path: "skills", select: "name" },
          { path: "mentorProfile.expertise", select: "name" },
        ],
      })
      .populate("menteeId", "name profilePhoto")
      .lean();

    res.json({ sessions });
    
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Mark a session as completed (mentor owner or admin)
exports.completeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    const requesterId = req.user?._id?.toString();
    const isMentorOwner = requesterId === session.mentorId?.toString();
    if (!isMentorOwner && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: only mentor or admin can complete" });
    }
    if (session.status !== "scheduled") {
      return res.status(400).json({ message: `Cannot complete a session with status '${session.status}'` });
    }
    session.status = "completed";
    await session.save();
    return res.json({ success: true, session });
  } catch (error) {
    console.error("Complete session error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel a session (mentor owner or admin)
exports.cancelSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    const requesterId = req.user?._id?.toString();
    const isMentorOwner = requesterId === session.mentorId?.toString();
    if (!isMentorOwner && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: only mentor or admin can cancel" });
    }
    if (session.status !== "scheduled") {
      return res.status(400).json({ message: `Cannot cancel a session with status '${session.status}'` });
    }
    session.status = "cancelled";
    await session.save();
    // Also unmark the mentor availability slot as free
    try {
      await User.updateOne(
        { _id: session.mentorId },
        {
          $set: {
            "mentorProfile.availability.$[day].slots.$[slot].isBooked": false,
          },
          $unset: {
            "mentorProfile.availability.$[day].slots.$[slot].bookedBy": "",
          },
        },
        {
          arrayFilters: [
            { "day._id": session.availabilityId },
            { "slot.time": session.slot },
          ],
        }
      );
    } catch (e) {
      console.warn("Availability unmark failed:", e.message);
    }
    return res.json({ success: true, session });
  } catch (error) {
    console.error("Cancel session error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};