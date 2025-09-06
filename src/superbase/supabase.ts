import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { ENV } from "../config/env";

// Use environment variables for Supabase credentials
const supabaseUrl = ENV.SUPABASE_URL;
const supabaseAnonKey = ENV.SUPABASE_ANON_KEY;

// console.log("Supabase: Creating client with URL:", supabaseUrl); // Debug log
// console.log("Supabase: Anon key set:", !!supabaseAnonKey); // Debug log

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    storageKey: "studypath-mobile-auth", // Custom storage key for mobile
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: "pkce",
  },
});

// console.log("Supabase: Client created with AsyncStorage for persistence"); // Debug log

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          level: "Beginner" | "Intermediate" | "Advanced";
          points: number;
          streak: number;
          rank: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          level?: "Beginner" | "Intermediate" | "Advanced";
          points?: number;
          streak?: number;
          rank?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          level?: "Beginner" | "Intermediate" | "Advanced";
          points?: number;
          streak?: number;
          rank?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          color: string[];
          difficulty: "Beginner" | "Intermediate" | "Advanced";
          chapters: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          color: string[];
          difficulty: "Beginner" | "Intermediate" | "Advanced";
          chapters: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          color?: string[];
          difficulty?: "Beginner" | "Intermediate" | "Advanced";
          chapters?: number;
          created_at?: string;
        };
      };
      chapters: {
        Row: {
          id: string;
          subject_id: string;
          title: string;
          description: string;
          lessons: number;
          points: number;
          difficulty: "Beginner" | "Intermediate" | "Advanced";
          created_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          title: string;
          description: string;
          lessons: number;
          points: number;
          difficulty: "Beginner" | "Intermediate" | "Advanced";
          created_at?: string;
        };
        Update: {
          id?: string;
          subject_id?: string;
          title?: string;
          description?: string;
          lessons?: number;
          points?: number;
          difficulty?: "Beginner" | "Intermediate" | "Advanced";
          created_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          chapter_id: string;
          completed: boolean;
          points_earned: number;
          completed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          chapter_id: string;
          completed?: boolean;
          points_earned?: number;
          completed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          chapter_id?: string;
          completed?: boolean;
          points_earned?: number;
          completed_at?: string;
          created_at?: string;
        };
      };
      feed_posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          type:
            | "achievement"
            | "question"
            | "milestone"
            | "tip"
            | "quiz_pack"
            | "lesson_pack";
          subject: string;
          achievement: string;
          points_earned: number;
          likes: number;
          comments: number;
          media_url: string | null;
          pack_data: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          type:
            | "achievement"
            | "question"
            | "milestone"
            | "tip"
            | "quiz_pack"
            | "lesson_pack";
          subject: string;
          achievement: string;
          points_earned?: number;
          likes?: number;
          comments?: number;
          media_url?: string | null;
          pack_data?: any | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          type?:
            | "achievement"
            | "question"
            | "milestone"
            | "tip"
            | "quiz_pack"
            | "lesson_pack";
          subject?: string;
          achievement?: string;
          points_earned?: number;
          likes?: number;
          comments?: number;
          media_url?: string | null;
          pack_data?: any | null;
          created_at?: string;
        };
      };
      feed_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
        };
      };
      mcqs: {
        Row: {
          id: string;
          subject_id: string;
          chapter_id: string;
          question: string;
          options: string[];
          correct_answer: number;
          explanation: string | null;
          difficulty: "easy" | "medium" | "hard";
          is_imported: boolean;
          imported_from_post_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          chapter_id: string;
          question: string;
          options: string[];
          correct_answer: number;
          explanation?: string | null;
          difficulty?: "easy" | "medium" | "hard";
          is_imported?: boolean;
          imported_from_post_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          subject_id?: string;
          chapter_id?: string;
          question?: string;
          options?: string[];
          correct_answer?: number;
          explanation?: string | null;
          difficulty?: "easy" | "medium" | "hard";
          is_imported?: boolean;
          imported_from_post_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

// Export typed client
export const supabaseTyped = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);
