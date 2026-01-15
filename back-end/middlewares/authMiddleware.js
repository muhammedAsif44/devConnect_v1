/**
 * Authentication Middleware with Redis Caching
 * 
 * This middleware verifies JWT tokens and attaches user data to requests.
 * Uses Redis caching to reduce database queries for repeated requests.
 */

const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const { getCache, setCache, deleteCache } = require("../utils/redisClient");

// Cache TTL: 5 minutes
const USER_CACHE_TTL = 300;

/**
 * Protect Middleware
 * Verifies access token and attaches user to request object.
 * Uses Redis cache to avoid repeated database queries.
 */
exports.protect = async (req, res, next) => {
  try {
    // Get token from cookies (supports both accessToken and legacy jwt)
    const token = req.cookies?.accessToken || req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
        tokenExpired: true
      });
    }

    // Verify JWT signature and expiry
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);

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

    // Build cache key
    const cacheKey = `auth:user:${decoded.userId}`;
    let user = null;

    // Check Redis cache first
    const cachedUser = await getCache(cacheKey);

    if (cachedUser) {
      // Cache hit - use cached data
      user = JSON.parse(cachedUser);
    } else {
      // Cache miss - query database
      user = await User.findById(decoded.userId)
        .select("_id name email role isActive isPremium status mentorProfile passwordChangedAt profilePhoto")
        .lean();

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Store in cache for future requests
      await setCache(cacheKey, JSON.stringify(user), USER_CACHE_TTL);
    }

    // Security check: Is account active?
    if (user.isActive === false) {
      return res.status(401).json({
        message: "Account deactivated. Please contact support.",
        accountDeactivated: true
      });
    }

    // Security check: Password changed after token issued?
    if (user.passwordChangedAt) {
      const passwordChangedTimestamp = parseInt(
        new Date(user.passwordChangedAt).getTime() / 1000,
        10
      );
      if (decoded.iat < passwordChangedTimestamp) {
        return res.status(401).json({
          message: "Password changed recently. Please login again.",
          passwordChanged: true
        });
      }
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(401).json({ message: "Not authorized" });
  }
};

/**
 * Authorize Roles Middleware
 * Restricts access to users with specified roles.
 * Usage: router.get("/admin", protect, authorizeRoles("admin"), controller)
 */
exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "Access denied: User not authenticated" });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: "Access denied: insufficient permissions",
      yourRole: req.user.role,
      requiredRoles: roles
    });
  }

  next();
};

/**
 * Invalidate User Cache
 * Call this when user data changes (profile update, password change, etc.)
 * @param {string} userId - User ID to invalidate
 */
exports.invalidateUserCache = async (userId) => {
  const cacheKey = `auth:user:${userId}`;
  await deleteCache(cacheKey);
};
