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

// Migration files in order
const migrations = [
  "01_initial_schema.sql",
  "02_row_level_security.sql",
  "03_users_policies.sql",
  "04_subjects_chapters_policies.sql",
  "05_user_progress_policies.sql",
  "06_feed_posts_policies.sql",
  "07_functions_and_triggers.sql",
  "08_sample_data.sql",
];

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
  console.log("🚀 Starting database migrations...");
  console.log(
    "⚠️  Note: This script requires the 'exec_sql' function to be available in your Supabase instance.",
  );
  console.log(
    "   If this fails, please run the migration files manually in Supabase SQL Editor.\n",
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
    console.log("\n🎉 All migrations completed successfully!");
    console.log("Your database is now ready for the StudyPath app!");
  } else {
    console.log(
      "\n⚠️  Some migrations failed. Please run them manually in Supabase SQL Editor.",
    );
  }
}

// Alternative: Manual migration instructions
function printManualInstructions() {
  console.log("\n📋 Manual Migration Instructions:");
  console.log(
    "If the automated migration fails, run these files in order in Supabase SQL Editor:\n",
  );

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
