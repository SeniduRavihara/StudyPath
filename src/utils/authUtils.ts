import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../superbase/supabase";

// Platform detection
const isWeb = typeof window !== "undefined";

/**
 * Clear all authentication data from storage
 * Useful for debugging or when auth gets corrupted
 */
export const clearAuthStorage = async () => {
  try {
    if (isWeb) {
      // Web: Clear localStorage
      localStorage.removeItem("studypath-admin-auth");
      localStorage.removeItem("sb-" + window.location.hostname + "-auth-token");
      console.log("Web Auth: Cleared localStorage auth data");
    } else {
      // Mobile: Clear AsyncStorage
      await AsyncStorage.removeItem("studypath-mobile-auth");
      await AsyncStorage.removeItem("supabase.auth.token");
      console.log("Mobile Auth: Cleared AsyncStorage auth data");
    }

    // Also sign out from Supabase
    await supabase.auth.signOut();
    console.log("Auth: Signed out from Supabase");

    return { success: true };
  } catch (error) {
    console.error("Auth: Error clearing storage:", error);
    return { success: false, error };
  }
};

/**
 * Check if authentication storage exists
 */
export const checkAuthStorage = async () => {
  try {
    if (isWeb) {
      // Web: Check localStorage
      const hasAuth = localStorage.getItem("studypath-admin-auth") !== null;
      console.log("Web Auth: Storage check - has auth data:", hasAuth);
      return { hasAuth, platform: "web" };
    } else {
      // Mobile: Check AsyncStorage
      const authData = await AsyncStorage.getItem("studypath-mobile-auth");
      const hasAuth = authData !== null;
      console.log("Mobile Auth: Storage check - has auth data:", hasAuth);
      return { hasAuth, platform: "mobile" };
    }
  } catch (error) {
    console.error("Auth: Error checking storage:", error);
    return { hasAuth: false, platform: isWeb ? "web" : "mobile", error };
  }
};

/**
 * Get current session info for debugging
 */
export const getSessionInfo = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return { error, session: null };
    }

    if (!session) {
      return { session: null, message: "No active session" };
    }

    return {
      session: {
        user: session.user?.email,
        expiresAt: new Date(session.expires_at! * 1000).toISOString(),
        isExpired: session.expires_at! * 1000 < Date.now(),
        accessToken: session.access_token ? "Present" : "Missing",
        refreshToken: session.refresh_token ? "Present" : "Missing",
      },
      storage: await checkAuthStorage(),
    };
  } catch (error) {
    console.error("Auth: Error getting session info:", error);
    return { error };
  }
};

/**
 * Force refresh the session
 */
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error("Auth: Error refreshing session:", error);
      return { error };
    }

    console.log("Auth: Session refreshed successfully");
    return { data };
  } catch (error) {
    console.error("Auth: Error refreshing session:", error);
    return { error };
  }
};
