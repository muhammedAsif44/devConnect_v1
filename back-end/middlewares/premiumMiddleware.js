// middleware/premiumMiddleware.js
const User = require("../model/userSchema");

exports.requirePremium = async (req, res, next) => {
  try {
    const user = req.user; // assuming authMiddleware already attached req.user

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ✅ Mentors always have unrestricted access
    if (user.role === "mentor") {
      return next();
    }

    // Auto-expire premium if expired
    if (user.isPremium && user.premiumExpiresAt && new Date(user.premiumExpiresAt) < new Date()) {
      await User.findByIdAndUpdate(user._id, { isPremium: false });
      user.isPremium = false;
    }

    if (!user.isPremium) {
      return res.status(403).json({ message: "Premium membership required" });
    }

    next();
  } catch (err) {
    console.error("Premium check failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};
