const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  durationInDays: { type: Number, required: true, min: 1 },
  isActive: { type: Boolean, default: true },
  features: [String], // Optional: array of feature descriptions
}, { timestamps: true });

module.exports = mongoose.model("Plan", planSchema);

