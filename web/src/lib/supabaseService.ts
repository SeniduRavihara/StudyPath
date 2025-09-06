import type { Database } from "./supabase";
import { supabase } from "./supabase";

type Subject = Database["public"]["Tables"]["subjects"]["Row"];
type Chapter = Database["public"]["Tables"]["chapters"]["Row"];
type MCQ = Database["public"]["Tables"]["mcqs"]["Row"];
type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
// Feed posts types removed - table not in current schema

export class SupabaseService {
  // Authentication
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  static async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  }

  // Subjects
  static async getSubjects() {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("created_at", { ascending: false });
    return { data, error };
  }

  static async createSubject(
    subject: Omit<Subject, "id" | "created_at" | "updated_at">,
  ) {
    const { data, error } = await supabase
      .from("subjects")
      .insert(subject)
      .select()
      .single();
    return { data, error };
  }

  static async updateSubject(id: string, updates: Partial<Subject>) {
    const { data, error } = await supabase
      .from("subjects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  }

  static async deleteSubject(id: string) {
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    return { error };
  }

  // Chapters
  static async getChapters(subjectId?: string) {
    let query = supabase
      .from("chapters")
      .select(
        `
        *,
        subjects (
          id,
          name,
          color
        )
      `,
      )
      .order("order_index", { ascending: true });

    if (subjectId) {
      query = query.eq("subject_id", subjectId);
    }

    const { data, error } = await query;
    return { data, error };
  }

  static async createChapter(
    chapter: Omit<Chapter, "id" | "created_at" | "updated_at">,
  ) {
    const { data, error } = await supabase
      .from("chapters")
      .insert(chapter)
      .select()
      .single();
    return { data, error };
  }

  static async updateChapter(id: string, updates: Partial<Chapter>) {
    const { data, error } = await supabase
      .from("chapters")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  }

  static async deleteChapter(id: string) {
    const { error } = await supabase.from("chapters").delete().eq("id", id);
    return { error };
  }

  // Lessons
  static async getLessons(chapterId?: string) {
    let query = supabase
      .from("lessons")
      .select(
        `
        *,
        chapters (
          id,
          title,
          subjects (
            id,
            name,
            color
          )
        )
      `,
      )
      .order("order_index", { ascending: true });

    if (chapterId) {
      query = query.eq("chapter_id", chapterId);
    }

    const { data, error } = await query;
    return { data, error };
  }

  static async createLesson(
    lesson: Omit<Lesson, "id" | "created_at" | "updated_at">,
  ) {
    const { data, error } = await supabase
      .from("lessons")
      .insert(lesson)
      .select()
      .single();
    return { data, error };
  }

  static async updateLesson(id: string, updates: Partial<Lesson>) {
    const { data, error } = await supabase
      .from("lessons")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  }

  static async deleteLesson(id: string) {
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    return { error };
  }

  // MCQs
  static async getMCQs(chapterId?: string) {
    let query = supabase
      .from("mcqs")
      .select(
        `
        *,
        chapters (
          id,
          title,
          subjects (
            id,
            name,
            color
          )
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (chapterId) {
      query = query.eq("chapter_id", chapterId);
    }

    const { data, error } = await query;
    return { data, error };
  }

  static async createMCQ(mcq: Omit<MCQ, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("mcqs")
      .insert(mcq)
      .select()
      .single();
    return { data, error };
  }

  static async updateMCQ(id: string, updates: Partial<MCQ>) {
    const { data, error } = await supabase
      .from("mcqs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  }

  static async deleteMCQ(id: string) {
    const { error } = await supabase.from("mcqs").delete().eq("id", id);
    return { error };
  }

  // Bulk operations
  static async bulkCreateMCQs(
    mcqs: Omit<MCQ, "id" | "created_at" | "updated_at">[],
  ) {
    const { data, error } = await supabase.from("mcqs").insert(mcqs).select();
    return { data, error };
  }

  // Database Introspection
  static async getDatabaseTables() {
    try {
      const { data, error } = await supabase.rpc("get_database_tables");
      if (error) {
        console.error("Error fetching database tables:", error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error("Error in getDatabaseTables:", error);
      return [];
    }
  }

  static async getDatabaseRelationships() {
    try {
      const { data, error } = await supabase.rpc("get_database_relationships");
      if (error) {
        console.error("Error fetching database relationships:", error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error("Error in getDatabaseRelationships:", error);
      return [];
    }
  }

  static async getDatabaseStats() {
    try {
      const { data, error } = await supabase.rpc("get_database_stats");
      if (error) {
        console.error("Error fetching database stats:", error);
        return {
          total_tables: 0,
          total_columns: 0,
          total_rows: 0,
          total_indexes: 0,
          total_constraints: 0,
          database_size: "0 MB",
          last_updated: new Date().toISOString(),
        };
      }
      return (
        data || {
          total_tables: 0,
          total_columns: 0,
          total_rows: 0,
          total_indexes: 0,
          total_constraints: 0,
          database_size: "0 MB",
          last_updated: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error("Error in getDatabaseStats:", error);
      return {
        total_tables: 0,
        total_columns: 0,
        total_rows: 0,
        total_indexes: 0,
        total_constraints: 0,
        database_size: "0 MB",
        last_updated: new Date().toISOString(),
      };
    }
  }

  // Feed Posts
  static async getFeedPosts() {
    const { data, error } = await supabase
      .from("feed_posts")
      .select(
        `
        *,
        users (
          id,
          email,
          user_metadata
        )
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  }

  // Feed post functions removed - table not in current schema

  // Statistics
  static async getStats() {
    const [
      subjectsCount,
      chaptersCount,
      lessonsCount,
      mcqsCount,
      feedPostsCount,
    ] = await Promise.all([
      supabase.from("subjects").select("*", { count: "exact", head: true }),
      supabase.from("chapters").select("*", { count: "exact", head: true }),
      supabase.from("lessons").select("*", { count: "exact", head: true }),
      supabase.from("mcqs").select("*", { count: "exact", head: true }),
      supabase.from("feed_posts").select("*", { count: "exact", head: true }),
    ]);

    return {
      subjects: subjectsCount.count || 0,
      chapters: chaptersCount.count || 0,
      lessons: lessonsCount.count || 0,
      mcqs: mcqsCount.count || 0,
      feedPosts: feedPostsCount.count || 0,
    };
  }
}
