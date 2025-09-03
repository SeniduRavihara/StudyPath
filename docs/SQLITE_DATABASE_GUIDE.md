# 📚 StudyPath SQLite Database Complete Guide

## 🎯 Overview

This guide explains everything about the SQLite database implementation in your StudyPath mobile app, from structure to usage patterns.

---

## 🏗️ Database Architecture

### **Technology Stack**

- **Database Engine**: SQLite 3
- **Package**: `expo-sqlite` (~15.1.4)
- **Storage**: Local device storage (app sandbox)
- **ORM**: Custom service layer (not a traditional ORM)

### **Why SQLite?**

- ✅ **Offline-first**: Works without internet
- ✅ **Lightweight**: Minimal app size increase
- ✅ **Fast**: Local storage = instant queries
- ✅ **Reliable**: ACID compliant transactions
- ✅ **Cross-platform**: Works on iOS, Android, Web

---

## 📁 File Structure

```
src/lib/
├── database.ts          # Core database operations
├── quizService.ts       # Business logic layer
├── seedDatabase.ts      # Sample data population
└── testDatabase.ts      # Testing utilities

scripts/
└── inspect-database.js  # Database inspection tool

docs/
└── SQLITE_DATABASE_GUIDE.md  # This file
```

---

## 🗄️ Database Schema

### **1. QUIZZES Table**

```sql
CREATE TABLE quizzes (
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
```

**Purpose**: Stores quiz metadata and configuration
**Key Fields**:

- `subject`: Mathematics, Physics, Chemistry, Biology
- `difficulty`: Beginner, Intermediate, Advanced
- `timeLimit`: Minutes allowed for quiz
- `questionCount`: Total number of questions

### **2. QUESTIONS Table**

```sql
CREATE TABLE questions (
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
```

**Purpose**: Stores individual quiz questions and answers
**Key Fields**:

- `quizId`: Links to parent quiz
- `correctAnswer`: 'A', 'B', 'C', or 'D'
- `questionOrder`: Sequence for question display
- `explanation`: Optional explanation of correct answer

### **3. QUIZ_ATTEMPTS Table**

```sql
CREATE TABLE quizAttempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quizId INTEGER NOT NULL,
  userId TEXT NOT NULL,
  score INTEGER NOT NULL,
  timeTaken INTEGER NOT NULL,
  completedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  answers TEXT NOT NULL,
  FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
);
```

**Purpose**: Tracks user quiz attempts and results
**Key Fields**:

- `score`: Percentage score (0-100)
- `timeTaken`: Seconds taken to complete
- `answers`: JSON string of user's answers
- `userId`: User identifier (currently hardcoded as "user123")

### **4. USER_PROGRESS Table**

```sql
CREATE TABLE userProgress (
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
```

**Purpose**: Tracks user learning progress by subject
**Key Fields**:

- `totalQuizzes`: Available quizzes in subject
- `completedQuizzes`: Quizzes user has taken
- `averageScore`: Mean score across all attempts
- `UNIQUE(userId, subject)`: One progress record per user per subject

---

## 🔧 Database Operations

### **Core Functions (database.ts)**

#### **Initialization**

```typescript
export const initDatabase = async (): Promise<void>
```

- Creates all tables if they don't exist
- Sets up foreign key constraints
- Enables WAL journal mode for better performance

#### **Quiz Management**

```typescript
// Create new quiz
async createQuiz(quizData: QuizData): Promise<SQLiteResult>

// Get quizzes by subject
async getQuizzesBySubject(subject: string): Promise<Quiz[]>

// Get quiz with all questions
async getQuizWithQuestions(quizId: number): Promise<QuizWithQuestions>
```

#### **Question Management**

```typescript
// Add question to quiz
async addQuestion(questionData: QuestionData): Promise<SQLiteResult>

// Get all questions
async getAllQuestions(): Promise<Question[]>
```

#### **User Progress**

```typescript
// Save quiz attempt
async saveQuizAttempt(attemptData: AttemptData): Promise<SQLiteResult>

// Get user progress
async getUserProgress(userId: string, subject: string): Promise<UserProgress>

// Update progress
async updateUserProgress(userId: string, subject: string, progressData: ProgressData): Promise<void>
```

---

## 🚀 Service Layer (quizService.ts)

### **Purpose**

Acts as a business logic layer between your React components and the raw database operations.

### **Key Methods**

```typescript
class QuizService {
  // Initialize database
  async initialize(): Promise<void>;

  // Create sample data
  async createSampleQuizzes(): Promise<SeedResult>;

  // Get quiz statistics
  async getQuizStats(userId: string, subject: string): Promise<QuizStats>;

  // Calculate and update user progress
  async calculateAndUpdateProgress(
    userId: string,
    subject: string,
    newScore: number,
  ): Promise<void>;
}
```

### **Usage Pattern**

```typescript
// In your React components
import quizService from "../../../lib/quizService";

// Always initialize first
await quizService.initialize();

// Then use any method
const quizzes = await quizService.getQuizzesBySubject("Mathematics");
```

---

## 🌱 Data Seeding (seedDatabase.ts)

### **Purpose**

Populates the database with sample quiz data for testing and demonstration.

### **Sample Data Included**

- **Mathematics**: 5 questions (Calculus, Algebra, Geometry)
- **Physics**: 3 questions (Mechanics, Newton's Laws, Energy)
- **Chemistry**: 3 questions (Atomic Structure, Elements, Compounds)
- **Biology**: 3 questions (Cell Biology, Genetics, Ecology)

### **Seeding Process**

1. Clears existing data
2. Creates quizzes for each subject
3. Adds questions to each quiz
4. Returns success/error status

---

## 📱 Database Location

### **Android**

```
Real Device: /data/data/com.yourapp.studypath/databases/studypath.db
Expo Go:     /data/data/host.exp.exponent/databases/ExponentExperienceData/studypath.db
```

### **iOS**

```
Simulator: ~/Library/Developer/CoreSimulator/Devices/[DEVICE_ID]/data/Containers/Data/Application/[APP_ID]/Documents/SQLiteStorage/studypath.db
```

### **Web (Expo Web)**

```
Browser IndexedDB (not a physical file)
```

---

## 🔍 How to View Your Database

### **Option 1: Debug Tab in App**

1. Open your app
2. Go to **Debug** tab (🐛 icon)
3. Tap **"📊 View Database"**
4. See all tables and data in real-time

### **Option 2: Console Logs**

1. Debug tab → **"📈 Log Database Stats"**
2. Check browser/Expo console for output
3. See table counts and database info

### **Option 3: Manual Database Inspection**

```bash
# Run the database inspector script
node scripts/inspect-database.js
```

---

## 🛠️ Database Management

### **Clearing Data**

```typescript
// Clear all data
await database.clearAllData();

// Clear specific tables
await db.execAsync("DELETE FROM quizzes; DELETE FROM questions;");
```

### **Backup & Restore**

Currently, the database is local only. For backup/restore functionality, you would need to:

1. Export data to JSON
2. Store in cloud storage
3. Import on new device

### **Migration Strategy**

For future schema changes:

1. Version your database schema
2. Add migration functions
3. Update `initDatabase()` to handle version upgrades

---

## 🔒 Security & Privacy

### **Data Isolation**

- Database is stored in app's private sandbox
- Other apps cannot access your data
- Data persists between app sessions
- Cleared when app is uninstalled

### **User Data**

- Currently uses hardcoded "user123" as userId
- In production, integrate with your Supabase auth
- Consider encrypting sensitive data

---

## 📊 Performance Considerations

### **Indexing**

```sql
-- Add indexes for better performance
CREATE INDEX idx_quizzes_subject ON quizzes(subject);
CREATE INDEX idx_questions_quizid ON questions(quizId);
CREATE INDEX idx_attempts_userid ON quizAttempts(userId);
```

### **Query Optimization**

- Use prepared statements
- Limit result sets
- Avoid SELECT \* in production
- Use transactions for multiple operations

---

## 🧪 Testing & Debugging

### **Test Scripts**

```bash
# Test database seeding
node scripts/test-database.js

# Inspect database structure
node scripts/inspect-database.js
```

### **Common Issues & Solutions**

#### **"Database not initialized" Error**

```typescript
// Always call initialize first
await quizService.initialize();
```

#### **"Table doesn't exist" Error**

```typescript
// Ensure initDatabase was called
await initDatabase();
```

#### **Performance Issues**

- Check if indexes exist
- Monitor query execution time
- Use database.getTableInfo() for diagnostics

---

## 🚀 Future Enhancements

### **Planned Features**

1. **Cloud Sync**: Backup to Supabase
2. **Offline Queue**: Queue operations when offline
3. **Data Export**: Export quiz results
4. **Analytics**: Learning progress insights
5. **Multi-language**: Support for different languages

### **Scalability Considerations**

- Implement pagination for large datasets
- Add database connection pooling
- Consider switching to PostgreSQL for complex queries
- Implement caching layer

---

## 📚 Additional Resources

### **SQLite Documentation**

- [SQLite Official Site](https://www.sqlite.org/)
- [expo-sqlite Documentation](https://docs.expo.dev/versions/latest/sdk/sqlite/)

### **React Native Database Patterns**

- [React Native SQLite Best Practices](https://reactnative.dev/docs/performance)
- [Expo Database Management](https://docs.expo.dev/guides/database/)

### **Your Project Files**

- `src/lib/database.ts` - Core database logic
- `src/lib/quizService.ts` - Business logic
- `src/app/debug/database.tsx` - Database viewer component

---

## ✅ Summary

Your StudyPath app uses a **local SQLite database** that:

- ✅ **Stores quiz data locally** on the device
- ✅ **Works offline** without internet connection
- ✅ **Persists data** between app sessions
- ✅ **Provides fast access** to quiz content
- ✅ **Tracks user progress** and quiz attempts
- ✅ **Is fully integrated** with your React Native app

The database is **real, functional, and working** - you just can't see the file directly because it's stored securely in your app's private storage area.

---

_Last updated: December 2024_  
_StudyPath SQLite Database Guide v1.0_
