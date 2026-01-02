const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
  transactionId: { type: String, required: true, unique: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: { 
    type: String, 
    enum: ["pending", "completed", "failed"], 
    default: "pending" 
  },
  type: { 
    type: String, 
    enum: ["premium_subscription"], 
    default: "premium_subscription" 
  },
  paymentMethod: { type: String }, // Card, UPI, Netbanking, etc.
}, { timestamps: true });

// Indexes for better query performance
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ status: 1, createdAt: -1 });
transactionSchema.index({ transactionId: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
