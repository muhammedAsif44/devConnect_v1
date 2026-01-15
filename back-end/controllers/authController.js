const User = require("../model/userSchema");
const Skill = require("../model/skillSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const { sendOTP, sendEmail } = require("../services/emailService");
const { signupSchema, loginSchema, otpSchema } = require("../utils/validationSchemas");

// ====================== GET PROFILE ======================
exports.getProfile = async (req, res) => {
  try {
    // SECURITY: Ensure req.user exists (handled by middleware but good double-check)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // PERFORMANCE: Use lean() for faster read access since we don't need Mongoose methods here
    // MEMORY OPTIMIZATION: Exclude heavy arrays (friends, followers, etc.)
    const user = await User.findById(req.user._id)
      .select("-password -friends -followers -following -incomingRequests -outgoingRequests")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    // Construct clean profile object
    const filteredUser = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isPremium: user.isPremium,
      premiumExpiresAt: user.premiumExpiresAt,
      profilePhoto: user.profilePhoto,  // ✅ FIX: Include profile photo
      feedback: user.feedback,
    };

    if (user.role === "developer") filteredUser.skills = user.skills;
    if (user.role === "admin") filteredUser.adminProfile = user.adminProfile;
    if (user.role === "mentor") filteredUser.mentorProfile = user.mentorProfile || {};

    // Logic for determining status
    // Optimization: If status isn't directly on user, derive it safely
    filteredUser.status = user.status || (
      user.mentorProfile?.approvedByAdmin
        ? "approved"
        : user.mentorProfile?.status === "rejected"
          ? "rejected"
          : "pending"
    );

    res.set("Cache-Control", "no-store");
    res.status(200).json({ user: filteredUser });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// ====================== SIGNUP ======================
exports.signup = async (req, res) => {
  try {
    // 1. VALIDATION: Joi (Security Best Practice)
    const result = await signupSchema.validateAsync(req.body);
    const { name, username, email, password, role, bio, skills, experience, availability } = result;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      name,
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      bio,
      isVerified: false,
      status: role === "mentor" ? "pending" : "approved",
    };

    if (req.file) userData.profilePhoto = req.file.path;

    // 2. SKILL OPTIMIZATION: bulkWrite (Performance: 1 DB call vs 3 calls)
    let skillIds = [];
    if (skills) {
      // SECURITY: Safe JSON parse inside try/catch handled by Joi/logic below if string
      let parsedSkills = skills;
      if (typeof skills === "string") {
        try {
          parsedSkills = JSON.parse(skills);
        } catch (e) {
          return res.status(400).json({ message: "Invalid skills format" });
        }
      }

      const skillNames = parsedSkills.map(s => s.trim()).filter(s => s.length >= 2);

      if (skillNames.length > 0) {
        // PERFORMANCE: atomic upsert via bulkWrite
        const updates = skillNames.map(name => ({
          updateOne: {
            filter: { name },
            update: { $setOnInsert: { name } }, // Only set name if inserting new
            upsert: true
          }
        }));

        await Skill.bulkWrite(updates);

        // Fetch IDs in one go
        const finalSkills = await Skill.find({ name: { $in: skillNames } }).select("_id");
        skillIds = finalSkills.map(s => s._id);
      }
    }

    // Mentor-specific data
    if (role === "mentor") {
      let structuredAvailability = [];
      if (availability) {
        let parsed = availability;
        if (typeof availability === "string") {
          try {
            parsed = JSON.parse(availability);
          } catch (e) {
            // Joi might catch this, but safe fallback
            parsed = [];
          }
        }

        if (Array.isArray(parsed)) {
          const byDay = {};
          parsed.forEach(slot => {
            // Expect "Day Time"
            const parts = slot.split(" ");
            if (parts.length >= 2) {
              const day = parts[0];
              const time = parts[1];
              if (!byDay[day]) byDay[day] = [];
              byDay[day].push({ time, isBooked: false });
            }
          });
          structuredAvailability = Object.entries(byDay).map(([day, slots]) => ({ day, date: new Date(), slots }));
        }
      }

      userData.mentorProfile = {
        expertise: skillIds,
        experience: experience || "",
        availability: structuredAvailability,
        verified: false,
        approvedByAdmin: false,
        status: "pending",
        sessionPrice: 0,
        mentorshipPlans: [],
      };

      // Handling email errors gracefully so they don't block signup flow completely is good,
      // BUT for critical notifications we usually want to know.
      // We will create the user first, then try email.
    } else {
      userData.skills = skillIds;
      userData.interests = [];
    }

    const user = await User.create(userData);

    // Send OTP separately - catch specific email errors
    try {
      await sendOTP(user, "signup");
      if (role === "mentor") {
        await sendEmail({
          to: userData.email,
          subject: "Mentor Application Pending",
          html: `<h3>Hi ${name},</h3><p>Application received. Pending approval.</p>`,
        });
      }
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      // Optional: Delete user if strict verification is required?
      // For now, we allow creation and user can resend OTP later.
    }

    res.status(201).json({
      message: "Signup successful. OTP sent for verification",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: userData.status,
      },
    });

  } catch (err) {
    if (err.isJoi) return res.status(400).json({ message: err.details[0].message });
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== VERIFY OTP ======================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = await otpSchema.validateAsync(req.body); // Joi Validation

    const user = await User.findOne({ email }).select("+password +otp +mentorProfile");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || !user.otp.code || user.otp.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired or invalid" });

    const isValid = await bcrypt.compare(otp, user.otp.code);
    if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

    const updateData = {
      isVerified: true,
      otp: undefined,
    };

    if (user.role === "developer") updateData.status = "approved";
    if (user.role === "mentor") updateData.status = "pending";

    //   FIX: Atomic update AND return 'new' document
    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, {
      new: true,
      runValidators: false,
    });

    res.status(200).json({
      message: "OTP verified successfully",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status, // Now correctly returns new status
      },
    });
  } catch (err) {
    if (err.isJoi) return res.status(400).json({ message: err.details[0].message });
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== LOGIN ======================
exports.login = async (req, res) => {
  try {
    const { email, password } = await loginSchema.validateAsync(req.body); // Joi Validation

    const user = await User.findOne({ email }).select("+password +mentorProfile +isVerified");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // SECURITY: Enforce email verification
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email address before logging in",
        isVerified: false
      });
    }

    const status = user.status || "approved";
    const { accessToken, refreshToken } = generateToken(res, user._id, user.role);

    // ATOMIC UPDATE for Refresh Token
    await User.findByIdAndUpdate(
      user._id,
      { refreshToken },
      { new: true, runValidators: false }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status,
        isPremium: user.isPremium || false,
        profilePhoto: user.profilePhoto,
        // Large arrays removed for performance in login response too if possible
        // but keeping existing behavior for login (usually okay to have initial state)
        friends: user.friends || [],
        followers: user.followers || [],
        following: user.following || [],
        incomingRequests: user.incomingRequests || [],
        outgoingRequests: user.outgoingRequests || [],
        mentorProfile: user.mentorProfile || {},
        skills: user.skills || [],
      },
    });
  } catch (err) {
    if (err.isJoi) return res.status(400).json({ message: err.details[0].message });
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== LOGOUT ======================
exports.logout = async (req, res) => {
  try {
    let userId = req.user?._id;

    // BUG FIX: If req.user is missing (access token expired), try to decode refresh token to find user
    if (!userId) {
      const { refreshToken } = req.cookies;
      if (refreshToken) {
        try {
          const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
          userId = decoded.userId;
        } catch (e) {
          // Token invalid, just clear cookies
        }
      }
    }

    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshToken: null });
    }

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      path: "/",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("jwt", cookieOptions);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ message: "Logout failed" });
  }
};

// ====================== REFRESH TOKEN ======================
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token provided",
        requireLogin: true
      });
    }

    // Verify token structure
    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );

      if (decoded.type !== "refresh") {
        return res.status(401).json({ message: "Invalid token type" });
      }
    } catch (err) {
      // ... existing error logic ...
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Refresh token expired", requireLogin: true });
      }
      return res.status(401).json({ message: "Invalid refresh token", requireLogin: true });
    }

    // Find user by ID + Token (Reuse Detection)
    const user = await User.findById(decoded.userId).select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken) {
      // SECURITY TRAP: If token doesn't match DB, it might be reuse -> Invalidate everything?
      // For now, we just deny this request.
      return res.status(401).json({
        message: "Invalid refresh token. Possible reuse or logout.",
        requireLogin: true
      });
    }

    // Rotation
    const { accessToken, refreshToken: newRefreshToken } = generateToken(res, user._id, user.role);

    await User.findByIdAndUpdate(
      user._id,
      { refreshToken: newRefreshToken },
      { new: true, runValidators: false }
    );

    res.status(200).json({
      message: "Token refreshed successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error("Refresh Token Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
