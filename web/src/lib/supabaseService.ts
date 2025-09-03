import type { Database } from "./supabase";
import { supabase } from "./supabase";

type Subject = Database["public"]["Tables"]["subjects"]["Row"];
type Chapter = Database["public"]["Tables"]["chapters"]["Row"];
type MCQ = Database["public"]["Tables"]["mcqs"]["Row"];
type Lesson = Database["public"]["Tables"]["lessons"]["Row"];

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

  // Statistics
  static async getStats() {
    const [subjectsCount, chaptersCount, lessonsCount, mcqsCount] =
      await Promise.all([
        supabase.from("subjects").select("*", { count: "exact", head: true }),
        supabase.from("chapters").select("*", { count: "exact", head: true }),
        supabase.from("lessons").select("*", { count: "exact", head: true }),
        supabase.from("mcqs").select("*", { count: "exact", head: true }),
      ]);

    return {
      subjects: subjectsCount.count || 0,
      chapters: chaptersCount.count || 0,
      lessons: lessonsCount.count || 0,
      mcqs: mcqsCount.count || 0,
    };
  }
}
