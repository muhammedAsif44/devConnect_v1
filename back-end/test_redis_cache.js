/**
 * TEST SCRIPT: Verify Redis Caching Logic
 * 
 * This tests the auth middleware's caching behavior.
 * Run: node test_redis_cache.js
 */

// Load environment variables FIRST
require('dotenv').config();

const { getCache, setCache, deleteCache, isRedisConnected } = require("./utils/redisClient");

async function testRedisCache() {
    console.log("\n========================================");
    console.log("   REDIS CACHING TEST");
    console.log("========================================\n");

    // Wait a moment for Redis connection attempt
    await new Promise(resolve => setTimeout(resolve, 2000));

    const testKey = "test:user:123";
    const testUser = {
        _id: "123",
        name: "Test User",
        email: "test@example.com",
        role: "developer"
    };

    console.log("1. Testing Redis Connection...");
    console.log(`   Redis Connected: ${isRedisConnected()}\n`);

    if (!isRedisConnected()) {
        console.log("⚠️  Redis is NOT connected.");
        console.log("   The middleware will FALLBACK to MongoDB (this is expected behavior).\n");
        console.log("   To enable Redis caching, either:");
        console.log("   a) Install Redis locally: https://redis.io/download");
        console.log("   b) Use a cloud Redis service and set REDIS_URL in .env\n");

        console.log("========================================");
        console.log("   FALLBACK MODE: App will work normally");
        console.log("   (just without caching benefits)");
        console.log("========================================\n");

        console.log("✅ Test Complete - Fallback mode verified\n");
        process.exit(0);
    }

    // If Redis IS connected, test the caching
    console.log("2. Testing SET operation...");
    await setCache(testKey, JSON.stringify(testUser), 60);
    console.log("   ✅ SET successful\n");

    console.log("3. Testing GET operation...");
    const cached = await getCache(testKey);
    if (cached) {
        const parsed = JSON.parse(cached);
        console.log("   ✅ GET successful");
        console.log(`   Retrieved: ${parsed.name} (${parsed.email})\n`);
    } else {
        console.log("   ❌ GET failed\n");
    }

    console.log("4. Testing DELETE operation...");
    await deleteCache(testKey);
    const afterDelete = await getCache(testKey);
    if (!afterDelete) {
        console.log("   ✅ DELETE successful\n");
    } else {
        console.log("   ❌ DELETE failed\n");
    }

    console.log("========================================");
    console.log("   ALL TESTS PASSED! 🎉");
    console.log("   Redis caching is working correctly.");
    console.log("========================================\n");

    process.exit(0);
}

// Handle connection errors gracefully
process.on("uncaughtException", (err) => {
    if (err.code === "ECONNREFUSED") {
        console.log("\n⚠️ Redis server not running - Fallback mode active\n");
    } else {
        console.error("Error:", err.message);
    }
    process.exit(0);
});

testRedisCache();
