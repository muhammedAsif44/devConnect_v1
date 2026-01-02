// const mongoose = require("mongoose");

// const sessionSchema = new mongoose.Schema(
//   {
//     mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     availabilityId: { type: mongoose.Schema.Types.ObjectId },

//     sessionType: {
//       type: String,
//       enum: ["one-on-one", "group"],
//       default: "one-on-one",
//     },

//     date: { type: String, required: true }, // Format: YYYY-MM-DD

//     slot: {
//       day: { type: String, required: true },
//       time: { type: String, required: true },
//     },

//     status: {
//       type: String,
//       enum: ["scheduled", "completed", "cancelled"],
//       default: "scheduled",
//     },

//     sessionLink: { type: String },

//     //   new field
//     feedbackGiven: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Session", sessionSchema);


// const mongoose = require("mongoose");

// const sessionSchema = new mongoose.Schema({
//   mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Mentors are users with role mentor
//   menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   availabilityId: { type: mongoose.Schema.Types.ObjectId },  
//   sessionType: { type: String, enum: ["one-on-one", "group"], default: "one-on-one" },
//   slot: String,
//   status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
//   sessionLink: String, // Optional link for online session
// }, { timestamps: true });

// module.exports = mongoose.model("Session", sessionSchema);

const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Mentors are users with role mentor
  menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  availabilityId: { type: mongoose.Schema.Types.ObjectId },  
  sessionType: { type: String, enum: ["one-on-one", "group"], default: "one-on-one" },
  date: { type: String, required: true }, // YYYY-MM-DD
  slot: String,
  status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
  sessionLink: String, // Optional link for online session
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);
