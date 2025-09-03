#!/usr/bin/env node

/**
 * Database Inspector Script
 *
 * This script helps you inspect the SQLite database from the command line.
 * Note: This won't work directly with the mobile app's database since it's
 * in the app's sandbox, but it shows you the database structure.
 */

console.log("🔍 Database Inspector");
console.log("====================");
console.log("");

console.log(
  "📱 Your SQLite database is located in the app's internal storage:",
);
console.log("");

console.log("🤖 Android:");
console.log(
  "   Real Device: /data/data/com.yourapp.studypath/databases/studypath.db",
);
console.log(
  "   Emulator:    /data/data/host.exp.exponent/databases/ExponentExperienceData/studypath.db",
);
console.log("");

console.log("🍎 iOS:");
console.log(
  "   Simulator: ~/Library/Developer/CoreSimulator/Devices/[DEVICE_ID]/data/Containers/Data/Application/[APP_ID]/Documents/SQLiteStorage/studypath.db",
);
console.log("");

console.log("🛠️ To view your database:");
console.log("1. Open your app");
console.log("2. Go to Profile tab");
console.log("3. Tap '📊 View Database'");
console.log("");

console.log("📋 Database Schema:");
console.log("==================");

const schema = {
  quizzes: {
    columns: [
      "id",
      "title",
      "description",
      "subject",
      "difficulty",
      "timeLimit",
      "questionCount",
      "createdAt",
      "updatedAt",
    ],
    description: "Stores quiz metadata and configuration",
  },
  questions: {
    columns: [
      "id",
      "quizId",
      "question",
      "optionA",
      "optionB",
      "optionC",
      "optionD",
      "correctAnswer",
      "explanation",
      "questionOrder",
    ],
    description: "Stores individual quiz questions and answers",
  },
  quizAttempts: {
    columns: [
      "id",
      "quizId",
      "userId",
      "score",
      "timeTaken",
      "completedAt",
      "answers",
    ],
    description: "Tracks user quiz attempts and results",
  },
  userProgress: {
    columns: [
      "id",
      "userId",
      "subject",
      "totalQuizzes",
      "completedQuizzes",
      "totalScore",
      "averageScore",
      "lastActivity",
    ],
    description: "Tracks user learning progress by subject",
  },
};

Object.entries(schema).forEach(([tableName, info]) => {
  console.log(`📊 ${tableName.toUpperCase()}`);
  console.log(`   ${info.description}`);
  console.log(`   Columns: ${info.columns.join(", ")}`);
  console.log("");
});

console.log("✅ Database is working if you can see quiz data in the app!");
