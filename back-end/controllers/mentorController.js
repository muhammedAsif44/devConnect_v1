const User = require("../model/userSchema");
const Session = require("../model/sessionSchema");
const userSchema = require("../model/userSchema");

// Get all approved mentors
exports.getMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: "mentor", status: "approved" })
      .select("-password")
      .populate("mentorProfile.expertise", "name")
      .populate({ path: "feedback.from", select: "name profilePhoto" })
      .lean();

    // 🧠 Directly use what's in DB, don't override `isBooked`
    const enriched = mentors.map((mentor) => {
      const availability = (mentor.mentorProfile?.availability || []).map((day) => ({
        ...day,
        slots: (day.slots || []).map((s) => ({
          ...s,
          isBooked: s.isBooked || false, // respect DB value
        })),
      }));

      return {
        ...mentor,
        mentorProfile: {
          ...mentor.mentorProfile,
          availability,
        },
      };
    });

    res.json({ mentors: enriched });
  } catch (error) {
    console.error("Error in getMentors:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// Get ratings for a single mentor
exports.getMentorRatings = async (req, res) => {
  try {
    const mentorId = req.params.id;
    const mentor = await User.findById(mentorId).select("mentorRating");
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.json({ rating: mentor.mentorRating });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};

exports.getAllMentors = async(req,res)=>{
  try {
    const mentors=await User.find({role:"mentor"})
    res.status(200).json({mentors})
  } catch (error) {
    
  }
}
