const mongoose = require("mongoose");
const User = require("../model/userSchema");
require("dotenv").config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists:");
      console.log("Email:", existingAdmin.email);
      console.log("Name:", existingAdmin.name);
      console.log("\nIf you want to create a new admin, please delete the existing one first.");
      process.exit(0);
    }

    // Create admin user
    const adminData = {
      name: "Admin User",
      email: "admin@devconnect.com",
      password: "admin123", // Change this password after first login!
      role: "admin",
      isActive: true,
    };

    const admin = await User.create(adminData);
    console.log("\n✅ Admin user created successfully!");
    console.log("Email:", admin.email);
    console.log("Password: admin123");
    console.log("\n⚠️  IMPORTANT: Please change the password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();
