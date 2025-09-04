import { SupabaseService } from "../superbase/services/supabaseService";

// Types for feed posts
export interface FeedUser {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  points: number;
  streak: number;
  rank: string;
}

export interface FeedPost {
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
  users: FeedUser;
}

export interface CreateFeedPostData {
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
  media_url?: string;
  pack_data?: any; // Add support for pack data
}

export class FeedService {
  // Get all feed posts
  static async getFeedPosts(): Promise<{
    data: FeedPost[] | null;
    error: any;
  }> {
    try {
      const { data, error } = await SupabaseService.getFeedPosts();
      return { data: data as FeedPost[] | null, error };
    } catch (error) {
      console.error("Error fetching feed posts:", error);
      return { data: null, error };
    }
  }

  // Get a single feed post by ID
  static async getFeedPostById(
    postId: string,
  ): Promise<{ data: FeedPost | null; error: any }> {
    try {
      const { data, error } = await SupabaseService.getFeedPostById(postId);
      return { data: data as FeedPost | null, error };
    } catch (error) {
      console.error("Error fetching feed post:", error);
      return { data: null, error };
    }
  }

  // Create a new feed post
  static async createFeedPost(
    postData: CreateFeedPostData,
  ): Promise<{ data: FeedPost | null; error: any }> {
    try {
      // Get current user
      const { user } = await SupabaseService.getCurrentUser();
      if (!user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      const { data, error } = await SupabaseService.createFeedPost({
        user_id: user.id,
        ...postData,
      });
      return { data: data as FeedPost | null, error };
    } catch (error) {
      console.error("Error creating feed post:", error);
      return { data: null, error };
    }
  }

  // Update a feed post
  static async updateFeedPost(
    postId: string,
    updates: Partial<CreateFeedPostData>,
  ): Promise<{ data: FeedPost | null; error: any }> {
    try {
      const { data, error } = await SupabaseService.updateFeedPost(
        postId,
        updates,
      );
      return { data: data as FeedPost | null, error };
    } catch (error) {
      console.error("Error updating feed post:", error);
      return { data: null, error };
    }
  }

  // Delete a feed post
  static async deleteFeedPost(postId: string): Promise<{ error: any }> {
    try {
      const { error } = await SupabaseService.deleteFeedPost(postId);
      return { error };
    } catch (error) {
      console.error("Error deleting feed post:", error);
      return { error };
    }
  }

  // Like a post
  static async likePost(
    postId: string,
  ): Promise<{ data: FeedPost | null; error: any }> {
    try {
      const { data, error } = await SupabaseService.likePost(postId);
      return { data: data as FeedPost | null, error };
    } catch (error) {
      console.error("Error liking post:", error);
      return { data: null, error };
    }
  }

  // Unlike a post
  static async unlikePost(
    postId: string,
  ): Promise<{ data: FeedPost | null; error: any }> {
    try {
      const { data, error } = await SupabaseService.unlikePost(postId);
      return { data: data as FeedPost | null, error };
    } catch (error) {
      console.error("Error unliking post:", error);
      return { data: null, error };
    }
  }

  // Increment comments count
  static async incrementComments(
    postId: string,
  ): Promise<{ data: FeedPost | null; error: any }> {
    try {
      const { data, error } = await SupabaseService.incrementComments(postId);
      return { data: data as FeedPost | null, error };
    } catch (error) {
      console.error("Error incrementing comments:", error);
      return { data: null, error };
    }
  }

  // Subscribe to real-time feed updates
  static subscribeToFeedUpdates(callback: (payload: any) => void) {
    return SupabaseService.subscribeToFeedPosts(callback);
  }

  // Helper function to format time ago
  static formatTimeAgo(dateString: string): string {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor(
      (now.getTime() - postDate.getTime()) / 1000,
    );

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  }

  // Helper function to get subject colors
  static getSubjectColors(): { [key: string]: [string, string] } {
    return {
      Mathematics: ["#667eea", "#764ba2"],
      Physics: ["#f093fb", "#f5576c"],
      Chemistry: ["#4facfe", "#00f2fe"],
      Biology: ["#43e97b", "#38f9d7"],
      "Study Tips": ["#ff9a9e", "#fad0c4"],
      "English Literature": ["#ff9ff3", "#54a0ff"],
    };
  }

  // Import MCQs from educational pack posts to SQLite
  static async importMCQPack(
    postId: string,
  ): Promise<{ success: boolean; error?: any; message?: string }> {
    try {
      // Get the post with pack data
      const { data: post, error: postError } =
        await this.getFeedPostById(postId);
      if (postError || !post || !post.pack_data) {
        return { success: false, error: "Post not found or no pack data" };
      }

      // Check if quiz already exists in SQLite with this postId
      const drizzleQuizService = await import("../lib/drizzleQuizService");
      const existingQuizzes =
        await drizzleQuizService.default.getQuizzesBySubject(post.subject);
      const alreadyImported = existingQuizzes.some(
        quiz => quiz.importedFromPostId === postId && quiz.isImported === true,
      );

      // If Supabase says imported but SQLite is empty, reset the Supabase flag
      if (post.pack_data.imported === true && !alreadyImported) {
        console.log("Resetting import flag for post:", postId);
        await this.updateFeedPost(postId, {
          pack_data: {
            ...post.pack_data,
            imported: false,
            importedAt: null,
          },
        });
        // Update the local post object
        post.pack_data.imported = false;
        post.pack_data.importedAt = null;
      }

      // Check if already imported (after potential reset)
      if (post.pack_data.imported === true && alreadyImported) {
        return {
          success: false,
          error: "Already imported",
          message: "This quiz pack has already been imported!",
        };
      }

      // Create quiz from pack data
      const quizData = {
        title: `${post.subject} - ${post.achievement}`,
        description: post.content,
        questionCount: post.pack_data.question_count || 10,
        timeLimit: 15,
        difficulty: post.pack_data.difficulty || "medium",
        subject: post.subject,
        chapter: post.pack_data.chapter || post.subject,
        isImported: true,
        importedFromPostId: postId,
      };

      const result =
        await drizzleQuizService.default.createQuizFromPack(quizData);

      if (result.success) {
        // Update the post to mark it as imported
        await this.updateFeedPost(postId, {
          pack_data: {
            ...post.pack_data,
            imported: true,
            importedAt: new Date().toISOString(),
          },
        });
        return {
          success: true,
          message: `Quiz pack imported successfully to ${post.subject} subject!`,
        };
      }

      return { success: result.success, error: result.error };
    } catch (error) {
      console.error("Error importing MCQ pack:", error);
      return { success: false, error };
    }
  }

  // Check if a pack has been imported
  static async isPackImported(postId: string): Promise<boolean> {
    try {
      const { data: post } = await this.getFeedPostById(postId);
      return post?.pack_data?.imported === true;
    } catch (error) {
      return false;
    }
  }

  // Get comments for a post
  static async getComments(postId: string): Promise<{
    data: any[] | null;
    error: any;
  }> {
    try {
      const { data, error } = await SupabaseService.getComments(postId);
      return { data, error };
    } catch (error) {
      console.error("Error fetching comments:", error);
      return { data: null, error };
    }
  }

  // Create a new comment
  static async createComment(
    postId: string,
    content: string,
  ): Promise<{ data: any | null; error: any }> {
    try {
      const { data, error } = await SupabaseService.createComment(
        postId,
        content,
      );
      return { data, error };
    } catch (error) {
      console.error("Error creating comment:", error);
      return { data: null, error };
    }
  }

  // Reset all import flags (useful when SQLite database is cleared)
  static async resetAllImportFlags(): Promise<{
    success: boolean;
    error?: any;
  }> {
    try {
      const { data: posts, error } = await this.getFeedPosts();
      if (error || !posts) {
        return { success: false, error: "Failed to fetch posts" };
      }

      const packPosts = posts.filter(
        post =>
          (post.type === "quiz_pack" || post.type === "lesson_pack") &&
          post.pack_data?.imported === true,
      );

      for (const post of packPosts) {
        await this.updateFeedPost(post.id, {
          pack_data: {
            ...post.pack_data,
            imported: false,
            importedAt: null,
          },
        });
      }

      console.log(`Reset import flags for ${packPosts.length} posts`);
      return { success: true };
    } catch (error) {
      console.error("Error resetting import flags:", error);
      return { success: false, error };
    }
  }
}
