// Simple test script to verify database functionality
// Run with: node scripts/test-database.js

const { seedDatabase } = require("../src/lib/seedDatabase");

async function testDatabase() {
  try {
    console.log("🧪 Testing database setup...");

    const result = await seedDatabase();

    console.log("✅ Database test successful!");
    console.log("📊 Result:", result);
  } catch (error) {
    console.error("❌ Database test failed:", error);
    process.exit(1);
  }
}

testDatabase();
