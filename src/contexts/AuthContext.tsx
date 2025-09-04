import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { SupabaseService } from "../superbase/services/supabaseService";
import { supabase } from "../superbase/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ data: any; error: any }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: any) => Promise<{ data: any; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: Initializing..."); // Debug log

    // Get initial session (this will restore from AsyncStorage automatically)
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(
        "AuthContext: Initial session restored:",
        session?.user?.email,
      ); // Debug log
      if (session) {
        console.log("AuthContext: User session found - auto login successful!"); // Debug log
      } else {
        console.log("AuthContext: No session found - user needs to login"); // Debug log
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        "AuthContext: Auth state change:",
        event,
        session?.user?.email,
      ); // Debug log

      // Immediately update state for SIGNED_OUT
      if (event === "SIGNED_OUT") {
        console.log("AuthContext: User signed out, clearing state..."); // Debug log
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // If user signs in, create/update profile
      if (event === "SIGNED_IN" && session?.user) {
        console.log("AuthContext: User signed in, checking profile..."); // Debug log
        try {
          const { data: profile, error } = await SupabaseService.getUserProfile(
            session.user.id,
          );

          console.log("AuthContext: Profile:", profile);

          if (error || !profile) {
            // Create new profile
            console.log("AuthContext: Creating new user profile..."); // Debug log
            const { error: createError } =
              await SupabaseService.createUserProfile(session.user.id, {
                email: session.user.email!,
                name: session.user.user_metadata?.name || "Student",
                level: "Beginner",
                points: 0,
                streak: 0,
                rank: "Novice",
              });
            if (createError) {
              console.error(
                "AuthContext: Failed to create user profile:",
                createError,
              );
            } else {
              console.log("AuthContext: User profile created successfully");
            }
          } else {
            console.log("AuthContext: User profile found:", profile.name);
          }
        } catch (error) {
          console.error("AuthContext: Error handling user profile:", error);
          // Don't let profile errors affect auth state
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    console.log("AuthContext: Signing up user:", email); // Debug log
    return await SupabaseService.signUp(email, password, name);
  };

  const signIn = async (email: string, password: string) => {
    console.log("AuthContext: Signing in user:", email); // Debug log
    return await SupabaseService.signIn(email, password);
  };

  const signOut = async () => {
    console.log("AuthContext: Signing out user..."); // Debug log
    // Immediately clear user state for instant UI update
    setUser(null);
    setSession(null);
    setLoading(false);

    try {
      const result = await SupabaseService.signOut();
      console.log("AuthContext: Sign out result:", result); // Debug log
      return result;
    } catch (error) {
      console.error("AuthContext: Sign out error:", error); // Debug log
      // Even if Supabase fails, we've already cleared the local state
      return { error };
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) throw new Error("No user logged in");
    return await SupabaseService.updateUserProfile(user.id, updates);
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  console.log("AuthContext: Current user:", user?.email, "Loading:", loading); // Debug log

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
