#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function simpleTest() {
  console.log("🔍 Simple Test - Checking what's in the database");

  // Test 1: Check if we have tables
  try {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .limit(1);

    if (error) {
      console.log("❌ Error accessing chapters table:", error.message);
    } else {
      console.log("✅ Chapters table accessible, rows:", data?.length || 0);
    }
  } catch (error) {
    console.log("❌ Exception:", error.message);
  }

  // Test 2: Check feed_posts
  try {
    const { data, error } = await supabase
      .from("feed_posts")
      .select("*")
      .limit(1);

    if (error) {
      console.log("❌ Error accessing feed_posts table:", error.message);
    } else {
      console.log("✅ Feed posts table accessible, rows:", data?.length || 0);
    }
  } catch (error) {
    console.log("❌ Exception:", error.message);
  }

  // Test 3: Check users
  try {
    const { data, error } = await supabase.from("users").select("*").limit(1);

    if (error) {
      console.log("❌ Error accessing users table:", error.message);
    } else {
      console.log("✅ Users table accessible, rows:", data?.length || 0);
    }
  } catch (error) {
    console.log("❌ Exception:", error.message);
  }

  // Test 4: Try the stats function again
  try {
    const { data, error } = await supabase.rpc("get_database_stats");
    if (error) {
      console.log("❌ Stats function error:", error.message);
    } else {
      console.log("✅ Stats function result:", data);
    }
  } catch (error) {
    console.log("❌ Stats function exception:", error.message);
  }
}

simpleTest().catch(console.error);
