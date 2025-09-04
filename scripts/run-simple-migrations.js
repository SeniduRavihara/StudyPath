const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables");
  console.log("Please create a .env file with:");
  console.log("EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url");
  console.log("EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple migration files
const migrations = ["01_simple_schema.sql", "02_sample_data.sql"];

async function runMigration(migrationFile) {
  try {
    const migrationPath = path.join(__dirname, "migrations", migrationFile);
    const sql = fs.readFileSync(migrationPath, "utf8");

    console.log(`\n🔄 Running migration: ${migrationFile}`);

    // Execute the SQL
    const { data, error } = await supabase.rpc("exec_sql", { sql_query: sql });

    if (error) {
      console.error(`❌ Error in ${migrationFile}:`, error.message);
      return false;
    }

    console.log(`✅ Successfully executed: ${migrationFile}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to run ${migrationFile}:`, error.message);
    return false;
  }
}

async function runAllMigrations() {
  console.log("🚀 Starting simple database setup...");
  console.log(
    "⚠️  Note: This creates tables WITHOUT Row Level Security policies",
  );
  console.log(
    "   If this fails, run the migration files manually in Supabase SQL Editor.\n",
  );

  let successCount = 0;

  for (const migration of migrations) {
    const success = await runMigration(migration);
    if (success) {
      successCount++;
    } else {
      console.log(`\n❌ Migration failed at: ${migration}`);
      console.log(
        "Please check the error above and run the remaining migrations manually.",
      );
      break;
    }
  }

  console.log(`\n📊 Migration Summary:`);
  console.log(`✅ Successful: ${successCount}/${migrations.length}`);

  if (successCount === migrations.length) {
    console.log("\n🎉 Database setup completed successfully!");
    console.log("Your database is now ready for the StudyPath app!");
    console.log("\nNext steps:");
    console.log("1. Test connection: npm run test:supabase");
    console.log("2. Seed feed posts: npm run seed:feed");
  } else {
    console.log(
      "\n⚠️  Some migrations failed. Please run them manually in Supabase SQL Editor.",
    );
  }
}

// Manual migration instructions
function printManualInstructions() {
  console.log("\n📋 Manual Migration Instructions:");
  console.log("Run these files in order in Supabase SQL Editor:\n");

  migrations.forEach((migration, index) => {
    console.log(`${index + 1}. ${migration}`);
  });

  console.log("\n📁 Migration files are located in: scripts/migrations/");
  console.log(
    "Copy each file's content and paste it into Supabase SQL Editor, then click 'Run'.",
  );
}

// Check if we should run automated or show manual instructions
const args = process.argv.slice(2);
if (args.includes("--manual")) {
  printManualInstructions();
} else {
  runAllMigrations().catch(console.error);
}
