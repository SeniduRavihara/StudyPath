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
  type: "achievement" | "question" | "milestone" | "tip";
  subject: string;
  achievement: string;
  points_earned: number;
  likes: number;
  comments: number;
  media_url: string | null;
  created_at: string;
  users: FeedUser;
}

export interface CreateFeedPostData {
  content: string;
  type: "achievement" | "question" | "milestone" | "tip";
  subject: string;
  achievement: string;
  points_earned?: number;
  media_url?: string;
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
}
