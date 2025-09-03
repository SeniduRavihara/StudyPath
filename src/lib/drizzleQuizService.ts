import { and, desc, eq } from "drizzle-orm";
import db, { initializeDrizzleDb } from "./drizzleDb";
import {
  questions,
  quizAttempts,
  quizzes,
  userProgress,
  type NewQuestion,
  type NewQuiz,
  type NewQuizAttempt,
  type NewUserProgress,
  type Question,
  type Quiz,
  type QuizAttempt,
  type UserProgress,
} from "./schema";

export interface QuizWithQuestions extends Quiz {
  questions: Question[];
}

class DrizzleQuizService {
  private initialized = false;

  async initialize() {
    if (!this.initialized) {
      await initializeDrizzleDb();
      this.initialized = true;
      console.log("🎯 Drizzle Quiz Service initialized");
    }
  }

  // Quiz Management
  async createQuiz(
    quizData: Omit<NewQuiz, "id" | "createdAt" | "updatedAt">,
  ): Promise<Quiz> {
    await this.initialize();

    const [newQuiz] = await db
      .insert(quizzes)
      .values({
        ...quizData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return newQuiz;
  }

  async getQuizzesBySubject(subject: string): Promise<Quiz[]> {
    await this.initialize();

    return await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.subject, subject))
      .orderBy(desc(quizzes.createdAt));
  }

  async getQuizWithQuestions(quizId: number): Promise<QuizWithQuestions> {
    await this.initialize();

    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId));

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    const quizQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.quizId, quizId))
      .orderBy(questions.questionOrder);

    return {
      ...quiz,
      questions: quizQuestions,
    };
  }

  // Question Management
  async addQuestion(questionData: Omit<NewQuestion, "id">): Promise<Question> {
    await this.initialize();

    const [newQuestion] = await db
      .insert(questions)
      .values(questionData)
      .returning();
    return newQuestion;
  }

  async getAllQuestions(): Promise<Question[]> {
    await this.initialize();

    return await db
      .select()
      .from(questions)
      .orderBy(questions.quizId, questions.questionOrder);
  }

  // Quiz Attempts
  async saveQuizAttempt(
    attemptData: Omit<NewQuizAttempt, "id" | "completedAt">,
  ): Promise<QuizAttempt> {
    await this.initialize();

    const [newAttempt] = await db
      .insert(quizAttempts)
      .values({
        ...attemptData,
        completedAt: new Date().toISOString(),
      })
      .returning();

    return newAttempt;
  }

  async getUserQuizAttempts(
    userId: string,
    quizId?: number,
  ): Promise<QuizAttempt[]> {
    await this.initialize();

    const whereCondition = quizId
      ? and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quizId))
      : eq(quizAttempts.userId, userId);

    return await db
      .select()
      .from(quizAttempts)
      .where(whereCondition)
      .orderBy(desc(quizAttempts.completedAt));
  }

  // User Progress
  async getUserProgress(
    userId: string,
    subject: string,
  ): Promise<UserProgress | null> {
    await this.initialize();

    const [progress] = await db
      .select()
      .from(userProgress)
      .where(
        and(eq(userProgress.userId, userId), eq(userProgress.subject, subject)),
      );

    return progress || null;
  }

  async updateUserProgress(
    userId: string,
    subject: string,
    progressData: Partial<Omit<NewUserProgress, "userId" | "subject">>,
  ): Promise<UserProgress> {
    await this.initialize();

    const existing = await this.getUserProgress(userId, subject);

    if (existing) {
      const [updated] = await db
        .update(userProgress)
        .set({
          ...progressData,
          lastActivity: new Date().toISOString(),
        })
        .where(
          and(
            eq(userProgress.userId, userId),
            eq(userProgress.subject, subject),
          ),
        )
        .returning();

      return updated;
    } else {
      const [newProgress] = await db
        .insert(userProgress)
        .values({
          userId,
          subject,
          ...progressData,
          lastActivity: new Date().toISOString(),
        })
        .returning();

      return newProgress;
    }
  }

  async calculateAndUpdateProgress(
    userId: string,
    subject: string,
    newScore: number,
  ): Promise<void> {
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

  // Database Management
  async clearAllData(): Promise<void> {
    await this.initialize();

    await db.delete(quizAttempts);
    await db.delete(questions);
    await db.delete(quizzes);
    await db.delete(userProgress);

    console.log("🗑️ All Drizzle database data cleared");
  }

  async getDatabaseStats(): Promise<{
    quizCount: number;
    questionCount: number;
    attemptCount: number;
    progressCount: number;
  }> {
    await this.initialize();

    const [quizCount, questionCount, attemptCount, progressCount] =
      await Promise.all([
        db
          .select()
          .from(quizzes)
          .then(rows => rows.length),
        db
          .select()
          .from(questions)
          .then(rows => rows.length),
        db
          .select()
          .from(quizAttempts)
          .then(rows => rows.length),
        db
          .select()
          .from(userProgress)
          .then(rows => rows.length),
      ]);

    return {
      quizCount,
      questionCount,
      attemptCount,
      progressCount,
    };
  }

  // Seed sample data
  async createSampleQuizzes(): Promise<{ success: boolean; message: string }> {
    await this.initialize();

    try {
      // Clear existing data
      await this.clearAllData();

      // Create Mathematics Quiz
      const mathQuiz = await this.createQuiz({
        title: "Basic Calculus",
        description:
          "Fundamental concepts of calculus including derivatives and integrals",
        subject: "Mathematics",
        difficulty: "Intermediate",
        timeLimit: 20,
        questionCount: 5,
      });

      // Add math questions
      await this.addQuestion({
        quizId: mathQuiz.id,
        question: "What is the derivative of x²?",
        optionA: "x",
        optionB: "2x",
        optionC: "x²",
        optionD: "2x²",
        correctAnswer: "B",
        explanation: "The derivative of x² is 2x using the power rule.",
        questionOrder: 1,
      });

      await this.addQuestion({
        quizId: mathQuiz.id,
        question: "Which of the following is a quadratic equation?",
        optionA: "x + 2 = 0",
        optionB: "x² + 3x + 1 = 0",
        optionC: "x³ + x = 0",
        optionD: "2x + 1 = 0",
        correctAnswer: "B",
        explanation: "A quadratic equation has the form ax² + bx + c = 0.",
        questionOrder: 2,
      });

      await this.addQuestion({
        quizId: mathQuiz.id,
        question: "What is the slope of a horizontal line?",
        optionA: "0",
        optionB: "1",
        optionC: "undefined",
        optionD: "-1",
        correctAnswer: "A",
        explanation: "A horizontal line has a slope of 0.",
        questionOrder: 3,
      });

      await this.addQuestion({
        quizId: mathQuiz.id,
        question: "Solve for x: 2x + 5 = 13",
        optionA: "x = 4",
        optionB: "x = 8",
        optionC: "x = 6",
        optionD: "x = 9",
        correctAnswer: "A",
        explanation: "2x + 5 = 13 → 2x = 8 → x = 4",
        questionOrder: 4,
      });

      await this.addQuestion({
        quizId: mathQuiz.id,
        question: "What is the area of a circle with radius 3?",
        optionA: "6π",
        optionB: "9π",
        optionC: "12π",
        optionD: "18π",
        correctAnswer: "B",
        explanation: "Area = πr² = π(3)² = 9π",
        questionOrder: 5,
      });

      // Create Physics Quiz
      const physicsQuiz = await this.createQuiz({
        title: "Mechanics Fundamentals",
        description: "Basic principles of classical mechanics",
        subject: "Physics",
        difficulty: "Beginner",
        timeLimit: 15,
        questionCount: 3,
      });

      await this.addQuestion({
        quizId: physicsQuiz.id,
        question: "What is the SI unit of force?",
        optionA: "Joule",
        optionB: "Newton",
        optionC: "Watt",
        optionD: "Pascal",
        correctAnswer: "B",
        explanation: "The SI unit of force is the Newton (N).",
        questionOrder: 1,
      });

      await this.addQuestion({
        quizId: physicsQuiz.id,
        question:
          "Which law states that every action has an equal and opposite reaction?",
        optionA: "Newton's First Law",
        optionB: "Newton's Second Law",
        optionC: "Newton's Third Law",
        optionD: "Newton's Law of Universal Gravitation",
        correctAnswer: "C",
        explanation:
          "Newton's Third Law states that every action has an equal and opposite reaction.",
        questionOrder: 2,
      });

      await this.addQuestion({
        quizId: physicsQuiz.id,
        question: "What is the formula for kinetic energy?",
        optionA: "KE = mgh",
        optionB: "KE = ½mv²",
        optionC: "KE = mv",
        optionD: "KE = ma",
        correctAnswer: "B",
        explanation:
          "Kinetic energy is calculated using KE = ½mv² where m is mass and v is velocity.",
        questionOrder: 3,
      });

      console.log("🌱 Drizzle sample data seeded successfully!");
      return {
        success: true,
        message: "Sample quizzes created successfully with Drizzle ORM",
      };
    } catch (error) {
      console.error("❌ Error seeding Drizzle database:", error);
      throw error;
    }
  }
}

export const drizzleQuizService = new DrizzleQuizService();
export default drizzleQuizService;
