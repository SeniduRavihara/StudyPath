import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          description: string;
          color: string;
          icon: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          color: string;
          icon: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          color?: string;
          icon?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      chapters: {
        Row: {
          id: string;
          subject_id: string;
          title: string;
          description: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          title: string;
          description: string;
          order_index: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          subject_id?: string;
          title?: string;
          description?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      mcqs: {
        Row: {
          id: string;
          chapter_id: string;
          question: string;
          options: string[];
          correct_answer: number;
          explanation: string;
          difficulty: "easy" | "medium" | "hard";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          question: string;
          options: string[];
          correct_answer: number;
          explanation: string;
          difficulty?: "easy" | "medium" | "hard";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          question?: string;
          options?: string[];
          correct_answer?: number;
          explanation?: string;
          difficulty?: "easy" | "medium" | "hard";
          created_at?: string;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          chapter_id: string;
          title: string;
          content: string;
          order_index: number;
          type: "text" | "video" | "interactive";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          title: string;
          content: string;
          order_index: number;
          type?: "text" | "video" | "interactive";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          title?: string;
          content?: string;
          order_index?: number;
          type?: "text" | "video" | "interactive";
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
