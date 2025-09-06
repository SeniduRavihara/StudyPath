#!/usr/bin/env node

/**
 * Subscription Migration Runner
 *
 * This script helps you run the subscription migration
 */

const fs = require("fs");
const path = require("path");

console.log("🔔 Subscription Migration Setup");
console.log("================================\n");

const migrationFile = path.join(
  __dirname,
  "migrations",
  "04_user_subscriptions.sql",
);

if (!fs.existsSync(migrationFile)) {
  console.error("❌ Migration file not found:", migrationFile);
  process.exit(1);
}

console.log("📄 Migration file found:", migrationFile);
console.log("\n📋 Next Steps:");
console.log("1. Go to your Supabase Dashboard");
console.log("2. Navigate to SQL Editor");
console.log("3. Copy and paste the contents of the migration file");
console.log("4. Run the SQL commands");
console.log("5. Your subscription system will be ready!\n");

console.log("📖 Migration file contents:");
console.log("================================\n");

const migrationContent = fs.readFileSync(migrationFile, "utf8");
console.log(migrationContent);

console.log(
  "\n✅ Setup complete! After running the migration, users can subscribe to subjects.",
);
console.log("\n🔗 Features added:");
console.log("- User subscription system");
console.log("- Browse and subscribe to subjects");
console.log("- Track user progress per subject");
