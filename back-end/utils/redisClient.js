/**
 * Redis Client Utility
 * 
 * Handles connection to Redis server for session caching.
 * Provides helper functions for cache operations.
 * Falls back gracefully if Redis is unavailable.
 * 
 * Environment Variables:
 * - REDIS_URL: Connection URL (rediss:// for TLS, redis:// for non-TLS)
 * - REDIS_HOST: Redis host (default: localhost)
 * - REDIS_PORT: Redis port (default: 6379)
 * - REDIS_PASSWORD: Optional password
 */

const Redis = require("ioredis");

const redisUrl = process.env.REDIS_URL;
const usesTLS = redisUrl && redisUrl.startsWith("rediss://");

let redis;

if (redisUrl) {
    redis = new Redis(redisUrl, {
        tls: usesTLS ? { rejectUnauthorized: false } : undefined,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
            if (times > 3) {
                console.log("[Redis] Max retries reached");
                return null;
            }
            return Math.min(times * 500, 2000);
        },
    });
} else {
    redis = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        retryStrategy: (times) => {
            if (times > 3) {
                console.log("[Redis] Max retries reached");
                return null;
            }
            return Math.min(times * 500, 2000);
        },
    });
}

let isConnected = false;

redis.on("connect", () => {
    console.log("[Redis] Connected");
    isConnected = true;
});

redis.on("error", (err) => {
    console.error("[Redis] Connection error:", err.message);
    isConnected = false;
});

redis.on("close", () => {
    console.log("[Redis] Connection closed");
    isConnected = false;
});

/**
 * Get value from cache
 * @param {string} key - Cache key
 * @returns {string|null} - Cached value or null
 */
const getCache = async (key) => {
    if (!isConnected) return null;
    try {
        return await redis.get(key);
    } catch (err) {
        console.error("[Redis] GET error:", err.message);
        return null;
    }
};

/**
 * Set value in cache with expiration
 * @param {string} key - Cache key
 * @param {string} value - Value to cache
 * @param {number} expireSeconds - TTL in seconds (default: 300)
 */
const setCache = async (key, value, expireSeconds = 300) => {
    if (!isConnected) return;
    try {
        await redis.set(key, value, "EX", expireSeconds);
    } catch (err) {
        console.error("[Redis] SET error:", err.message);
    }
};

/**
 * Delete key from cache
 * @param {string} key - Cache key to delete
 */
const deleteCache = async (key) => {
    if (!isConnected) return;
    try {
        await redis.del(key);
    } catch (err) {
        console.error("[Redis] DEL error:", err.message);
    }
};

/**
 * Delete multiple keys matching a pattern
 * @param {string} pattern - Pattern like "user:*"
 */
const deleteCachePattern = async (pattern) => {
    if (!isConnected) return;
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    } catch (err) {
        console.error("[Redis] Pattern delete error:", err.message);
    }
};

module.exports = {
    redis,
    getCache,
    setCache,
    deleteCache,
    deleteCachePattern,
    isRedisConnected: () => isConnected,
};
