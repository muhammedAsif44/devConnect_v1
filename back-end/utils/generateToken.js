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

  // Set Access Token Cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Set Refresh Token Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
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
