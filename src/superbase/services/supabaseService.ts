import { supabase } from "../supabase";

export class SupabaseService {
  // User Management
  static async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    return { data, error };
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  static async signOut() {
    console.log("SupabaseService: Attempting to sign out..."); // Debug log
    const { error } = await supabase.auth.signOut();
    console.log("SupabaseService: Sign out result:", { error }); // Debug log
    return { error };
  }

  static async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  }

  // User Profile
  static async createUserProfile(userId: string, profile: any) {
    const { data, error } = await supabase
      .from("users")
      .insert([{ id: userId, ...profile }])
      .select()
      .single();
    return { data, error };
  }

  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    return { data, error };
  }

  static async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    return { data, error };
  }

  // Subjects
  static async getSubjects() {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("name");
    return { data, error };
  }

  static async getSubjectById(id: string) {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  }

  // Chapters
  static async getChaptersBySubject(subjectId: string) {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("subject_id", subjectId)
      .order("created_at");
    return { data, error };
  }

  static async getChapterById(id: string) {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  }

  // User Progress
  static async getUserProgress(userId: string) {
    const { data, error } = await supabase
      .from("user_progress")
      .select(
        `
        *,
        chapters (
          *,
          subjects (*)
        )
      `,
      )
      .eq("user_id", userId);
    return { data, error };
  }

  static async updateProgress(
    userId: string,
    chapterId: string,
    completed: boolean,
    points: number,
  ) {
    const { data, error } = await supabase
      .from("user_progress")
      .upsert({
        user_id: userId,
        chapter_id: chapterId,
        completed,
        points_earned: points,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .select()
      .single();
    return { data, error };
  }

  // Feed Posts
  static async getFeedPosts() {
    const { data, error } = await supabase
      .from("feed_posts")
      .select(
        `
        *,
        users (
          name,
          level,
          points,
          streak,
          rank
        )
      `,
      )
      .order("created_at", { ascending: false });
    return { data, error };
  }

  static async getFeedPostById(postId: string) {
    const { data, error } = await supabase
      .from("feed_posts")
      .select(
        `
        *,
        users (
          name,
          level,
          points,
          streak,
          rank
        )
      `,
      )
      .eq("id", postId)
      .single();
    return { data, error };
  }

  static async createFeedPost(post: {
    user_id: string;
    content: string;
    type: "achievement" | "question" | "milestone" | "tip";
    subject: string;
    achievement: string;
    points_earned?: number;
    media_url?: string;
  }) {
    const { data, error } = await supabase
      .from("feed_posts")
      .insert([post])
      .select(
        `
        *,
        users (
          name,
          level,
          points,
          streak,
          rank
        )
      `,
      )
      .single();
    return { data, error };
  }

  static async updateFeedPost(
    postId: string,
    updates: {
      content?: string;
      subject?: string;
      achievement?: string;
      media_url?: string;
    },
  ) {
    const { data, error } = await supabase
      .from("feed_posts")
      .update(updates)
      .eq("id", postId)
      .select(
        `
        *,
        users (
          name,
          level,
          points,
          streak,
          rank
        )
      `,
      )
      .single();
    return { data, error };
  }

  static async deleteFeedPost(postId: string) {
    const { error } = await supabase
      .from("feed_posts")
      .delete()
      .eq("id", postId);
    return { error };
  }

  static async likePost(postId: string) {
    // First get current likes count
    const { data: currentPost } = await supabase
      .from("feed_posts")
      .select("likes")
      .eq("id", postId)
      .single();

    if (!currentPost) {
      return { data: null, error: { message: "Post not found" } };
    }

    const { data, error } = await supabase
      .from("feed_posts")
      .update({ likes: currentPost.likes + 1 })
      .eq("id", postId)
      .select()
      .single();
    return { data, error };
  }

  static async unlikePost(postId: string) {
    // First get current likes count
    const { data: currentPost } = await supabase
      .from("feed_posts")
      .select("likes")
      .eq("id", postId)
      .single();

    if (!currentPost) {
      return { data: null, error: { message: "Post not found" } };
    }

    const { data, error } = await supabase
      .from("feed_posts")
      .update({ likes: Math.max(currentPost.likes - 1, 0) })
      .eq("id", postId)
      .select()
      .single();
    return { data, error };
  }

  static async incrementComments(postId: string) {
    // First get current comments count
    const { data: currentPost } = await supabase
      .from("feed_posts")
      .select("comments")
      .eq("id", postId)
      .single();

    if (!currentPost) {
      return { data: null, error: { message: "Post not found" } };
    }

    const { data, error } = await supabase
      .from("feed_posts")
      .update({ comments: currentPost.comments + 1 })
      .eq("id", postId)
      .select()
      .single();
    return { data, error };
  }

  // Real-time subscriptions
  static subscribeToFeedPosts(callback: (payload: any) => void) {
    return supabase
      .channel("feed_posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feed_posts" },
        callback,
      )
      .subscribe();
  }

  static subscribeToUserProgress(
    userId: string,
    callback: (payload: any) => void,
  ) {
    return supabase
      .channel("user_progress")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_progress",
          filter: `user_id=eq.${userId}`,
        },
        callback,
      )
      .subscribe();
  }
}
