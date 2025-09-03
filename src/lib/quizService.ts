import database, { initDatabase } from "./database";
import seedDatabase from "./seedDatabase";

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  subject: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeLimit: number;
  questionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: number;
  quizId: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation?: string;
  questionOrder: number;
}

export interface QuizWithQuestions extends Quiz {
  questions: Question[];
}

export interface QuizAttempt {
  id: number;
  quizId: number;
  userId: string;
  score: number;
  timeTaken: number;
  completedAt: string;
  answers: string;
}

export interface UserProgress {
  id: number;
  userId: string;
  subject: string;
  totalQuizzes: number;
  completedQuizzes: number;
  totalScore: number;
  averageScore: number;
  lastActivity: string;
}

class QuizService {
  private initialized = false;

  async initialize() {
    if (!this.initialized) {
      await initDatabase();
      this.initialized = true;
    }
  }

  // Quiz Management
  async createQuiz(quizData: {
    title: string;
    description?: string;
    subject: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    timeLimit: number;
    questionCount: number;
  }): Promise<number> {
    await this.initialize();
    return await database.createQuiz(quizData);
  }

  async addQuestion(questionData: {
    quizId: number;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
    explanation?: string;
    questionOrder: number;
  }): Promise<number> {
    await this.initialize();
    return await database.addQuestion(questionData);
  }

  async getQuizzesBySubject(subject: string): Promise<Quiz[]> {
    await this.initialize();
    return await database.getQuizzesBySubject(subject);
  }

  async getQuizWithQuestions(quizId: number): Promise<QuizWithQuestions> {
    await this.initialize();
    return await database.getQuizWithQuestions(quizId);
  }

  // Quiz Attempts
  async saveQuizAttempt(attemptData: {
    quizId: number;
    userId: string;
    score: number;
    timeTaken: number;
    answers: string;
  }): Promise<number> {
    await this.initialize();
    return await database.saveQuizAttempt(attemptData);
  }

  // User Progress
  async getUserProgress(
    userId: string,
    subject: string,
  ): Promise<UserProgress | null> {
    await this.initialize();
    return await database.getUserProgress(userId, subject);
  }

  async updateUserProgress(
    userId: string,
    subject: string,
    progressData: {
      totalQuizzes?: number;
      completedQuizzes?: number;
      totalScore?: number;
      averageScore?: number;
    },
  ): Promise<void> {
    await this.initialize();
    return await database.updateUserProgress(userId, subject, progressData);
  }

  // Helper methods
  async createSampleQuizzes() {
    await this.initialize();
    try {
      // Use the comprehensive seedDatabase function
      const result = await seedDatabase();
      console.log("✅ Sample quizzes created:", result.message);
      return result;
    } catch (error) {
      console.error("❌ Error creating sample quizzes:", error);
      throw error;
    }
  }

  async getQuizStats(userId: string, subject: string) {
    await this.initialize();
    const progress = await this.getUserProgress(userId, subject);

    if (!progress) {
      return {
        totalQuizzes: 0,
        completedQuizzes: 0,
        averageScore: 0,
        totalScore: 0,
      };
    }

    return {
      totalQuizzes: progress.totalQuizzes,
      completedQuizzes: progress.completedQuizzes,
      averageScore: progress.averageScore,
      totalScore: progress.totalScore,
    };
  }

  async calculateAndUpdateProgress(
    userId: string,
    subject: string,
    newScore: number,
  ) {
    await this.initialize();
    const currentProgress = await this.getUserProgress(userId, subject);

    if (currentProgress) {
      const newTotalScore = currentProgress.totalScore + newScore;
      const newCompletedQuizzes = currentProgress.completedQuizzes + 1;
      const newAverageScore = newTotalScore / newCompletedQuizzes;

      await this.updateUserProgress(userId, subject, {
        totalScore: newTotalScore,
        completedQuizzes: newCompletedQuizzes,
        averageScore: newAverageScore,
      });
    } else {
      await this.updateUserProgress(userId, subject, {
        totalQuizzes: 1,
        completedQuizzes: 1,
        totalScore: newScore,
        averageScore: newScore,
      });
    }
  }
}

export const quizService = new QuizService();
export default quizService;
