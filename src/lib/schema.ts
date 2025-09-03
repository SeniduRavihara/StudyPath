import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Quizzes table
export const quizzes = sqliteTable("quizzes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  subject: text("subject").notNull(),
  difficulty: text("difficulty", {
    enum: ["Beginner", "Intermediate", "Advanced"],
  }).notNull(),
  timeLimit: integer("timeLimit").notNull(), // in minutes
  questionCount: integer("questionCount").notNull(),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").default(sql`CURRENT_TIMESTAMP`),
});

// Questions table
export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quizId: integer("quizId")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  optionA: text("optionA").notNull(),
  optionB: text("optionB").notNull(),
  optionC: text("optionC").notNull(),
  optionD: text("optionD").notNull(),
  correctAnswer: text("correctAnswer", {
    enum: ["A", "B", "C", "D"],
  }).notNull(),
  explanation: text("explanation"),
  questionOrder: integer("questionOrder").notNull(),
});

// Quiz attempts table
export const quizAttempts = sqliteTable("quizAttempts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quizId: integer("quizId")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  userId: text("userId").notNull(),
  score: integer("score").notNull(), // percentage 0-100
  timeTaken: integer("timeTaken").notNull(), // in seconds
  completedAt: text("completedAt").default(sql`CURRENT_TIMESTAMP`),
  answers: text("answers").notNull(), // JSON string of user answers
});

// User progress table
export const userProgress = sqliteTable("userProgress", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("userId").notNull(),
  subject: text("subject").notNull(),
  totalQuizzes: integer("totalQuizzes").default(0),
  completedQuizzes: integer("completedQuizzes").default(0),
  totalScore: integer("totalScore").default(0),
  averageScore: real("averageScore").default(0),
  lastActivity: text("lastActivity").default(sql`CURRENT_TIMESTAMP`),
});

// Type exports for TypeScript
export type Quiz = typeof quizzes.$inferSelect;
export type NewQuiz = typeof quizzes.$inferInsert;

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type NewQuizAttempt = typeof quizAttempts.$inferInsert;

export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;
