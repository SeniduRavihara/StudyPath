const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log("🔍 Testing Supabase Connection...");
console.log("URL:", supabaseUrl ? "✅ Set" : "❌ Missing");
console.log("Key:", supabaseKey ? "✅ Set" : "❌ Missing");

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables");
  console.log("Please create a .env file with:");
  console.log("EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url");
  console.log("EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log("\n🔗 Testing database connection...");

    // Test 1: Check if feed_posts table exists and has media_url column
    const { data: tableInfo, error: tableError } = await supabase
      .from("feed_posts")
      .select("id, media_url")
      .limit(1);

    if (tableError) {
      console.error("❌ Table test failed:", tableError.message);
      if (tableError.message.includes('relation "feed_posts" does not exist')) {
        console.log("💡 Run the schema update in Supabase SQL Editor first!");
      }
      return;
    }

    console.log("✅ feed_posts table exists and accessible");

    // Test 2: Check if users table exists
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    if (usersError) {
      console.error("❌ Users table test failed:", usersError.message);
      return;
    }

    console.log("✅ users table exists and accessible");

    // Test 3: Check current feed posts count
    const { count, error: countError } = await supabase
      .from("feed_posts")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("❌ Count test failed:", countError.message);
      return;
    }

    console.log(`✅ Found ${count} feed posts in database`);

    if (count === 0) {
      console.log("💡 Run 'npm run seed:feed' to add sample posts");
    }

    console.log("\n🎉 Supabase connection test successful!");
    console.log("Your feed database is ready to use!");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

testConnection();
