import * as SQLite from "expo-sqlite";

// Database connection
const db = SQLite.openDatabaseSync("studypath.db");

// Initialize database and create tables
export const initDatabase = async (): Promise<void> => {
  try {
    console.log("🔄 Initializing database...");

    // Create quizzes table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        subject TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        timeLimit INTEGER NOT NULL,
        questionCount INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create questions table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quizId INTEGER NOT NULL,
        question TEXT NOT NULL,
        optionA TEXT NOT NULL,
        optionB TEXT NOT NULL,
        optionC TEXT NOT NULL,
        optionD TEXT NOT NULL,
        correctAnswer TEXT NOT NULL,
        explanation TEXT,
        questionOrder INTEGER NOT NULL,
        FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
      );
    `);

    // Create quiz attempts table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS quizAttempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quizId INTEGER NOT NULL,
        userId TEXT NOT NULL,
        score INTEGER NOT NULL,
        timeTaken INTEGER NOT NULL,
        completedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        answers TEXT NOT NULL,
        FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
      );
    `);

    // Create user progress table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS userProgress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        subject TEXT NOT NULL,
        totalQuizzes INTEGER DEFAULT 0,
        completedQuizzes INTEGER DEFAULT 0,
        totalScore INTEGER DEFAULT 0,
        averageScore REAL DEFAULT 0,
        lastActivity DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(userId, subject)
      );
    `);

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    throw error;
  }
};

// Database operations
export const database = {
  // Quiz operations
  async createQuiz(quizData: {
    title: string;
    description?: string;
    subject: string;
    difficulty: string;
    timeLimit: number;
    questionCount: number;
  }): Promise<number> {
    try {
      const result = await db.runAsync(
        `INSERT INTO quizzes (title, description, subject, difficulty, timeLimit, questionCount)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          quizData.title,
          quizData.description || "",
          quizData.subject,
          quizData.difficulty,
          quizData.timeLimit,
          quizData.questionCount,
        ],
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error("Error creating quiz:", error);
      throw error;
    }
  },

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
    try {
      const result = await db.runAsync(
        `INSERT INTO questions (quizId, question, optionA, optionB, optionC, optionD, correctAnswer, explanation, questionOrder)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          questionData.quizId,
          questionData.question,
          questionData.optionA,
          questionData.optionB,
          questionData.optionC,
          questionData.optionD,
          questionData.correctAnswer,
          questionData.explanation || "",
          questionData.questionOrder,
        ],
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error("Error adding question:", error);
      throw error;
    }
  },

  async getQuizzesBySubject(subject: string): Promise<any[]> {
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM quizzes WHERE subject = ? ORDER BY createdAt DESC`,
        [subject],
      );
      return result;
    } catch (error) {
      console.error("Error getting quizzes by subject:", error);
      throw error;
    }
  },

  async getQuizWithQuestions(quizId: number): Promise<any> {
    try {
      // Get quiz details
      const quizResult = await db.getFirstAsync(
        `SELECT * FROM quizzes WHERE id = ?`,
        [quizId],
      );

      if (!quizResult) {
        throw new Error("Quiz not found");
      }

      // Get questions for this quiz
      const questionsResult = await db.getAllAsync(
        `SELECT * FROM questions WHERE quizId = ? ORDER BY questionOrder`,
        [quizId],
      );

      return {
        ...quizResult,
        questions: questionsResult,
      };
    } catch (error) {
      console.error("Error getting quiz with questions:", error);
      throw error;
    }
  },

  async saveQuizAttempt(attemptData: {
    quizId: number;
    userId: string;
    score: number;
    timeTaken: number;
    answers: string;
  }): Promise<number> {
    try {
      const result = await db.runAsync(
        `INSERT INTO quizAttempts (quizId, userId, score, timeTaken, answers)
         VALUES (?, ?, ?, ?, ?)`,
        [
          attemptData.quizId,
          attemptData.userId,
          attemptData.score,
          attemptData.timeTaken,
          attemptData.answers,
        ],
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
      throw error;
    }
  },

  async getUserProgress(userId: string, subject: string): Promise<any> {
    try {
      const result = await db.getFirstAsync(
        `SELECT * FROM userProgress WHERE userId = ? AND subject = ?`,
        [userId, subject],
      );
      return result || null;
    } catch (error) {
      console.error("Error getting user progress:", error);
      throw error;
    }
  },

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
    try {
      // Check if progress exists
      const existing = await this.getUserProgress(userId, subject);

      if (existing) {
        // Update existing progress
        const newData = {
          totalQuizzes: progressData.totalQuizzes ?? existing.totalQuizzes,
          completedQuizzes:
            progressData.completedQuizzes ?? existing.completedQuizzes,
          totalScore: progressData.totalScore ?? existing.totalScore,
          averageScore: progressData.averageScore ?? existing.averageScore,
        };

        await db.runAsync(
          `UPDATE userProgress SET totalQuizzes = ?, completedQuizzes = ?, totalScore = ?, averageScore = ?, lastActivity = CURRENT_TIMESTAMP WHERE userId = ? AND subject = ?`,
          [
            newData.totalQuizzes,
            newData.completedQuizzes,
            newData.totalScore,
            newData.averageScore,
            userId,
            subject,
          ],
        );
      } else {
        // Create new progress
        await db.runAsync(
          `INSERT INTO userProgress (userId, subject, totalQuizzes, completedQuizzes, totalScore, averageScore)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            userId,
            subject,
            progressData.totalQuizzes ?? 0,
            progressData.completedQuizzes ?? 0,
            progressData.totalScore ?? 0,
            progressData.averageScore ?? 0,
          ],
        );
      }
    } catch (error) {
      console.error("Error updating user progress:", error);
      throw error;
    }
  },

  // Utility functions
  async clearAllData(): Promise<void> {
    try {
      await db.execAsync(`DELETE FROM quizAttempts`);
      await db.execAsync(`DELETE FROM questions`);
      await db.execAsync(`DELETE FROM quizzes`);
      await db.execAsync(`DELETE FROM userProgress`);
      console.log("✅ All data cleared");
    } catch (error) {
      console.error("❌ Error clearing data:", error);
      throw error;
    }
  },

  async getTableInfo(): Promise<void> {
    try {
      console.log("📊 Database Info:");

      const quizCount = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM quizzes`,
      );
      const questionCount = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM questions`,
      );
      const attemptCount = await db.getFirstAsync(
        `SELECT COUNT(*) as count FROM quizAttempts`,
      );

      console.log(`- Quizzes: ${quizCount?.count || 0}`);
      console.log(`- Questions: ${questionCount?.count || 0}`);
      console.log(`- Attempts: ${attemptCount?.count || 0}`);
    } catch (error) {
      console.error("❌ Error getting table info:", error);
    }
  },

  // Utility functions for database inspection
  async getAllQuizzes(): Promise<any[]> {
    try {
      return await db.getAllAsync(
        `SELECT * FROM quizzes ORDER BY createdAt DESC`,
      );
    } catch (error) {
      console.error("Error getting all quizzes:", error);
      return [];
    }
  },

  async getAllQuestions(): Promise<any[]> {
    try {
      return await db.getAllAsync(
        `SELECT * FROM questions ORDER BY quizId, questionOrder`,
      );
    } catch (error) {
      console.error("Error getting all questions:", error);
      return [];
    }
  },

  async getAllAttempts(): Promise<any[]> {
    try {
      return await db.getAllAsync(
        `SELECT * FROM quizAttempts ORDER BY completedAt DESC`,
      );
    } catch (error) {
      console.error("Error getting all attempts:", error);
      return [];
    }
  },

  async getAllProgress(): Promise<any[]> {
    try {
      return await db.getAllAsync(
        `SELECT * FROM userProgress ORDER BY lastActivity DESC`,
      );
    } catch (error) {
      console.error("Error getting all progress:", error);
      return [];
    }
  },
};

export default database;
