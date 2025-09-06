import { supabase } from "../supabase";

export interface Subject {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  chapters: number;
  created_at: string;
  is_subscribed?: boolean;
  user_progress?: {
    completed_chapters: number;
    total_xp: number;
    streak: number;
  };
}

export interface UserSubscription {
  id: string;
  user_id: string;
  subject_id: string;
  subscribed_at: string;
  is_active: boolean;
  subject: Subject;
}

export class SubscriptionService {
  // Get all available subjects
  static async getAllSubjects(): Promise<Subject[]> {
    try {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching subjects:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getAllSubjects:", error);
      return [];
    }
  }

  // Get user's subscribed subjects with progress
  static async getUserSubscriptions(userId: string): Promise<Subject[]> {
    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select(
          `
          *,
          subject:subjects(*)
        `,
        )
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("subscribed_at", { ascending: false });

      if (error) {
        console.error("Error fetching user subscriptions:", error);
        return [];
      }

      // Get progress for each subscribed subject
      const subjectsWithProgress = await Promise.all(
        (data || []).map(async (subscription: any) => {
          const subject = subscription.subject;

          // Get user's progress for this subject
          const { data: progressData } = await supabase
            .from("user_progress")
            .select(
              `
              *,
              chapter:chapters(*)
            `,
            )
            .eq("user_id", userId)
            .eq("completed", true);

          const completedChapters =
            progressData?.filter(
              (progress: any) => progress.chapter?.subject_id === subject.id,
            ).length || 0;

          const totalXp =
            progressData?.reduce(
              (sum: number, progress: any) =>
                sum + (progress.points_earned || 0),
              0,
            ) || 0;

          // Calculate streak (simplified - you might want to implement proper streak logic)
          const streak = Math.floor(Math.random() * 10); // Placeholder

          return {
            ...subject,
            is_subscribed: true,
            user_progress: {
              completed_chapters: completedChapters,
              total_xp: totalXp,
              streak: streak,
            },
          };
        }),
      );

      return subjectsWithProgress;
    } catch (error) {
      console.error("Error in getUserSubscriptions:", error);
      return [];
    }
  }

  // Subscribe to a subject
  static async subscribeToSubject(
    userId: string,
    subjectId: string,
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from("user_subscriptions").insert({
        user_id: userId,
        subject_id: subjectId,
        is_active: true,
      });

      if (error) {
        console.error("Error subscribing to subject:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in subscribeToSubject:", error);
      return false;
    }
  }

  // Unsubscribe from a subject
  static async unsubscribeFromSubject(
    userId: string,
    subjectId: string,
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("user_subscriptions")
        .update({ is_active: false })
        .eq("user_id", userId)
        .eq("subject_id", subjectId);

      if (error) {
        console.error("Error unsubscribing from subject:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in unsubscribeFromSubject:", error);
      return false;
    }
  }

  // Get available subjects that user hasn't subscribed to
  static async getAvailableSubjects(userId: string): Promise<Subject[]> {
    try {
      // Get all subjects
      const allSubjects = await this.getAllSubjects();

      // Get user's subscribed subject IDs
      const { data: subscriptions } = await supabase
        .from("user_subscriptions")
        .select("subject_id")
        .eq("user_id", userId)
        .eq("is_active", true);

      const subscribedIds = subscriptions?.map(sub => sub.subject_id) || [];

      // Filter out subscribed subjects
      return allSubjects.filter(subject => !subscribedIds.includes(subject.id));
    } catch (error) {
      console.error("Error in getAvailableSubjects:", error);
      return [];
    }
  }

  // Check if user is subscribed to a subject
  static async isSubscribed(
    userId: string,
    subjectId: string,
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("id")
        .eq("user_id", userId)
        .eq("subject_id", subjectId)
        .eq("is_active", true)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found"
        console.error("Error checking subscription:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Error in isSubscribed:", error);
      return false;
    }
  }
}
