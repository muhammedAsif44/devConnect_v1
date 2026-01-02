// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

exports.protect = async (req, res, next) => {
  try {
    // Check for access token (new system) or jwt token (backward compatibility)
    const token = req.cookies?.accessToken || req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
        tokenExpired: true
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verify it's an access token (if type field exists)
      if (decoded.type && decoded.type !== "access") {
        return res.status(401).json({ message: "Invalid token type" });
      }
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Access token expired. Please refresh.",
          tokenExpired: true
        });
      }
      return res.status(401).json({ message: "Invalid authentication token." });
    }

    const user = await User.findById(decoded.userId).select("+password +passwordChangedAt");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // If user changed password after token was issued, invalidate token
    if (user.passwordChangedAt) {
      const pwdChangedTs = parseInt(new Date(user.passwordChangedAt).getTime() / 1000, 10);
      if (decoded.iat < pwdChangedTs) {
        return res.status(401).json({ message: "Password changed recently. Please login again." });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(401).json({ message: "Not authorized" });
  }
};

exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    console.error("Authorization failed: No user in request");
    return res.status(403).json({ message: "Access denied: User not authenticated" });
  }

  if (!roles.includes(req.user.role)) {
    console.error(`Authorization failed: User role '${req.user.role}' not in allowed roles [${roles.join(', ')}]`);
    return res.status(403).json({
      message: "Access denied: insufficient permissions",
      yourRole: req.user.role,
      requiredRoles: roles
    });
  }

  next();
};