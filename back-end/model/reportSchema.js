const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  entityType: { type: String, enum: ["User", "Post", "Comment"], required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "entityType" },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { 
    type: String, 
    enum: ["Spam/Promotional", "Inappropriate Content", "Harassment", "Misinformation", "Off-topic Content", "Other"],
    required: true 
  },
  description: { type: String, default: "" },
  status: { type: String, enum: ["pending", "reviewed", "dismissed", "removed"], default: "pending" },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewedAt: { type: Date },
  adminNotes: { type: String }
}, { timestamps: true });

// Index for faster queries
reportSchema.index({ entityType: 1, entityId: 1, status: 1 });
reportSchema.index({ reportedBy: 1 });
reportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Report", reportSchema);
