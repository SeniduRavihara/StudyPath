// Environment configuration for Supabase
export const ENV = {
  SUPABASE_URL:
    process.env.EXPO_PUBLIC_SUPABASE_URL || "YOUR_SUPABASE_PROJECT_URL",
  SUPABASE_ANON_KEY:
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY",
};

// Validate environment variables
export const validateEnv = () => {
  console.log("ENV: Checking environment variables..."); // Debug log
  console.log("ENV: SUPABASE_URL:", process.env.EXPO_PUBLIC_SUPABASE_URL); // Debug log
  console.log(
    "ENV: SUPABASE_ANON_KEY:",
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "NOT SET",
  ); // Debug log
  console.log("ENV: Final SUPABASE_URL:", ENV.SUPABASE_URL); // Debug log

  if (ENV.SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL") {
    console.warn(
      "⚠️  Please set EXPO_PUBLIC_SUPABASE_URL in your environment variables",
    );
  }
  if (ENV.SUPABASE_ANON_KEY === "YOUR_SUPABASE_ANON_KEY") {
    console.warn(
      "⚠️  Please set EXPO_PUBLIC_SUPABASE_ANON_KEY in your environment variables",
    );
  }
};
