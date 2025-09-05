#!/usr/bin/env node

/**
 * Test Database Functions Script
 *
 * This script tests if the database introspection functions are working
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables");
  console.log(
    "Make sure you have EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseFunctions() {
  console.log("🔍 Testing Database Functions");
  console.log("==============================\n");

  // Test 1: Check if functions exist
  console.log("1. Checking if functions exist...");
  try {
    const { data: functions, error } = await supabase
      .from("pg_proc")
      .select("proname")
      .in("proname", [
        "get_database_tables",
        "get_database_relationships",
        "get_database_stats",
      ]);

    if (error) {
      console.log("   Using alternative method to check functions...");
      // Alternative: try to call the functions directly
    } else {
      console.log("   Functions found:", functions?.map(f => f.proname) || []);
    }
  } catch (error) {
    console.log("   Could not check function existence directly");
  }

  // Test 2: Try to call get_database_stats
  console.log("\n2. Testing get_database_stats()...");
  try {
    const { data, error } = await supabase.rpc("get_database_stats");
    if (error) {
      console.log("   ❌ Error:", error.message);
      console.log("   Details:", error.details);
      console.log("   Hint:", error.hint);
    } else {
      console.log("   ✅ Success!");
      console.log("   Data:", data);
    }
  } catch (error) {
    console.log("   ❌ Exception:", error.message);
  }

  // Test 3: Try to call get_database_tables
  console.log("\n3. Testing get_database_tables()...");
  try {
    const { data, error } = await supabase.rpc("get_database_tables");
    if (error) {
      console.log("   ❌ Error:", error.message);
      console.log("   Details:", error.details);
      console.log("   Hint:", error.hint);
    } else {
      console.log("   ✅ Success!");
      console.log("   Tables found:", data?.length || 0);
      if (data && data.length > 0) {
        console.log("   First table:", data[0].table_name);
      }
    }
  } catch (error) {
    console.log("   ❌ Exception:", error.message);
  }

  // Test 4: Try to call get_database_relationships
  console.log("\n4. Testing get_database_relationships()...");
  try {
    const { data, error } = await supabase.rpc("get_database_relationships");
    if (error) {
      console.log("   ❌ Error:", error.message);
      console.log("   Details:", error.details);
      console.log("   Hint:", error.hint);
    } else {
      console.log("   ✅ Success!");
      console.log("   Relationships found:", data?.length || 0);
    }
  } catch (error) {
    console.log("   ❌ Exception:", error.message);
  }

  // Test 5: Check if we have any tables at all
  console.log("\n5. Checking if we have any tables...");
  try {
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_type", "BASE TABLE");

    if (error) {
      console.log("   ❌ Error accessing information_schema:", error.message);
    } else {
      console.log("   ✅ Found tables:", data?.length || 0);
      if (data && data.length > 0) {
        console.log(
          "   Table names:",
          data.map(t => t.table_name),
        );
      }
    }
  } catch (error) {
    console.log("   ❌ Exception:", error.message);
  }

  console.log("\n==============================");
  console.log("Test completed!");
}

testDatabaseFunctions().catch(console.error);
