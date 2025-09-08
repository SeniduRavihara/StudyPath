// Debug utility to check session persistence
import { supabase } from "../lib/supabase";

export const debugSession = () => {
  console.log("=== SESSION DEBUG ===");

  // Check localStorage
  const authKey = "studypath-admin-auth";
  const storedAuth = localStorage.getItem(authKey);
  console.log("Stored auth data:", storedAuth ? "Present" : "Not found");

  if (storedAuth) {
    try {
      const parsed = JSON.parse(storedAuth);
      console.log("Session expires at:", new Date(parsed.expires_at * 1000));
      console.log(
        "Refresh token expires at:",
        new Date(parsed.refresh_token_expires_at * 1000),
      );
      console.log(
        "Time until session expires:",
        Math.round((parsed.expires_at * 1000 - Date.now()) / 1000 / 60),
        "minutes",
      );
    } catch (e) {
      console.log("Error parsing stored auth:", e);
    }
  }

  // Check current session
  supabase.auth.getSession().then(({ data: { session }, error }) => {
    if (error) {
      console.log("Error getting session:", error);
    } else if (session) {
      console.log(
        "Current session expires at:",
        new Date(session.expires_at! * 1000),
      );
      console.log(
        "Time until current session expires:",
        Math.round((session.expires_at! * 1000 - Date.now()) / 1000 / 60),
        "minutes",
      );
    } else {
      console.log("No current session");
    }
  });

  console.log("=== END DEBUG ===");
};

// Call this function in browser console to debug session issues
(window as any).debugSession = debugSession;


