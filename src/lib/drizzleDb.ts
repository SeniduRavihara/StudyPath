import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

// Open SQLite database
const expoDb = openDatabaseSync("studypath.db");

// Create Drizzle database instance
export const db = drizzle(expoDb, { schema });

// Migration function (for future use)
export const runMigrations = async () => {
  try {
    // Note: For now we'll create tables manually since we don't have migration files yet
    console.log("🚀 Drizzle database initialized");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};

// Initialize database tables manually (temporary solution)
export const initializeDrizzleDb = async () => {
  try {
    // Create tables using raw SQL for now
    await expoDb.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        subject TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        timeLimit INTEGER NOT NULL,
        questionCount INTEGER NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );

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

      CREATE TABLE IF NOT EXISTS quizAttempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quizId INTEGER NOT NULL,
        userId TEXT NOT NULL,
        score INTEGER NOT NULL,
        timeTaken INTEGER NOT NULL,
        completedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        answers TEXT NOT NULL,
        FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS userProgress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        subject TEXT NOT NULL,
        totalQuizzes INTEGER DEFAULT 0,
        completedQuizzes INTEGER DEFAULT 0,
        totalScore INTEGER DEFAULT 0,
        averageScore REAL DEFAULT 0,
        lastActivity TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(userId, subject)
      );
    `);

    console.log("✅ Drizzle database tables created successfully");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    throw error;
  }
};

export default db;
