// Script to seed premium plans into the database
// Run with: node back-end/scripts/seedPlans.js

require("dotenv").config();
const mongoose = require("mongoose");
const Plan = require("../model/planSchema");

const plans = [
  {
    title: "Monthly Premium",
    description: "Perfect for trying out premium features. Full access for one month.",
    price: 499,
    durationInDays: 30,
    features: [
      "Unlimited mentorship bookings",
      "Priority booking slots",
      "Direct messaging with mentors",
      "Session management tools",
    ],
    isActive: true,
  },
  {
    title: "Quarterly Premium",
    description: "Best value for committed learners. Save 13% compared to monthly.",
    price: 1299,
    durationInDays: 90,
    features: [
      "Unlimited mentorship bookings",
      "Priority booking slots",
      "Direct messaging with mentors",
      "Session management tools",
      "13% savings",
    ],
    isActive: true,
  },
  {
    title: "Annual Premium",
    description: "Maximum savings for long-term users. Best value with 33% savings.",
    price: 3999,
    durationInDays: 365,
    features: [
      "Unlimited mentorship bookings",
      "Priority booking slots",
      "Direct messaging with mentors",
      "Session management tools",
      "33% savings",
      "Priority customer support",
    ],
    isActive: true,
  },
];

async function seedPlans() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/devconnect");
    console.log("✅ Connected to MongoDB");

    // Clear existing plans (optional - remove if you want to keep existing)
    // await Plan.deleteMany({});
    // console.log("🗑️  Cleared existing plans");

    // Insert plans
    const result = await Plan.insertMany(plans);
    console.log(`✅ Successfully seeded ${result.length} plans:`);
    result.forEach((plan) => {
      console.log(`   - ${plan.title}: ₹${plan.price} for ${plan.durationInDays} days`);
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding plans:", err);
    process.exit(1);
  }
}

seedPlans();

