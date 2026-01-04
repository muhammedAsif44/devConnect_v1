const jwt = require("jsonwebtoken");

/**
 * Generate access and refresh tokens
 * Access Token: Short-lived (15 minutes) - for API requests
 * Refresh Token: Long-lived (7 days) - for getting new access tokens
 */
const generateTokens = (res, userId, role) => {
  // Generate Access Token (short-lived)
  const accessToken = jwt.sign(
    { userId, role, type: "access" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // 15 minutes
  );

  // Generate Refresh Token (long-lived)
  const refreshToken = jwt.sign(
    { userId, type: "refresh" },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d" } // 7 days
  );

  // Determine environment
  const isProduction = process.env.NODE_ENV === "production";

  // Common cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // Secure is REQUIRED for SameSite=None
    sameSite: isProduction ? "none" : "strict", // Cross-site requires None
    path: "/", // Ensure path is root
  };

  // Set Access Token Cookie
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Set Refresh Token Cookie
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { accessToken, refreshToken };
};

/**
 * Backward compatibility: Keep old function name
 */
const generateToken = (res, userId, role) => {
  return generateTokens(res, userId, role);
};

module.exports = generateToken;
module.exports.generateTokens = generateTokens;
