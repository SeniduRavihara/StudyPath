# 🚀 Drizzle ORM Migration Guide

## 🎯 Overview

This guide shows how to migrate from raw SQL to Drizzle ORM in your StudyPath app for better type safety, developer experience, and maintainability.

---

## 📊 Comparison: Raw SQL vs Drizzle ORM

### **Before (Raw SQL)**

```typescript
// Raw SQL - No type safety
const result = await db.runAsync(
  `INSERT INTO quizzes (title, subject, difficulty, timeLimit, questionCount) VALUES (?, ?, ?, ?, ?)`,
  [title, subject, difficulty, timeLimit, questionCount],
);

// Manual type definitions
interface Quiz {
  id: number;
  title: string;
  subject: string;
  // ... rest manually defined
}
```

### **After (Drizzle ORM)**

```typescript
// Drizzle ORM - Full type safety
const newQuiz = await db
  .insert(quizzes)
  .values({
    title,
    subject,
    difficulty,
    timeLimit,
    questionCount,
  })
  .returning();

// Automatic type inference
type Quiz = typeof quizzes.$inferSelect; // ✨ Automatically typed!
```

---

## 🏗️ New File Structure

```
src/lib/
├── database.ts              # 📜 Legacy raw SQL (keep for now)
├── quizService.ts           # 📜 Legacy service (keep for now)
├── schema.ts                # 🆕 Drizzle schema definition
├── drizzleDb.ts            # 🆕 Drizzle database connection
├── drizzleQuizService.ts   # 🆕 Drizzle-powered service
└── seedDatabase.ts         # 📜 Legacy seeder (keep for now)

drizzle.config.ts           # 🆕 Drizzle configuration
scripts/
├── test-drizzle-orm.js     # 🆕 Test Drizzle setup
└── inspect-database.js     # 📜 Legacy inspector
```

---

## 🎯 Key Benefits of Drizzle ORM

### **1. Type Safety** ✅

```typescript
// ❌ Raw SQL - Runtime errors possible
const quiz = await db.getFirstAsync("SELECT * FROM quizzes WHERE id = ?", [id]);
quiz.titel; // Typo! No error until runtime

// ✅ Drizzle - Compile-time safety
const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
quiz.titel; // ❌ TypeScript error - property doesn't exist!
```

### **2. Intuitive Query Builder** ✅

```typescript
// ❌ Raw SQL - String concatenation hell
const conditions = [];
const params = [];
if (subject) {
  conditions.push("subject = ?");
  params.push(subject);
}
if (difficulty) {
  conditions.push("difficulty = ?");
  params.push(difficulty);
}
const sql = `SELECT * FROM quizzes ${conditions.length ? "WHERE " + conditions.join(" AND ") : ""}`;

// ✅ Drizzle - Composable conditions
let query = db.select().from(quizzes);
if (subject) query = query.where(eq(quizzes.subject, subject));
if (difficulty) query = query.where(eq(quizzes.difficulty, difficulty));
```

### **3. Automatic Type Inference** ✅

```typescript
// ❌ Raw SQL - Manual type definitions
interface QuizWithQuestions {
  id: number;
  title: string;
  questions: Array<{
    id: number;
    question: string;
    // ... manually define everything
  }>;
}

// ✅ Drizzle - Automatic inference
type Quiz = typeof quizzes.$inferSelect; // 🎯 Auto-generated
type Question = typeof questions.$inferSelect; // 🎯 Auto-generated
type NewQuiz = typeof quizzes.$inferInsert; // 🎯 Auto-generated
```

### **4. Better Developer Experience** ✅

```typescript
// ❌ Raw SQL - No autocomplete, no validation
await db.runAsync("INSERT INTO quizes...", []); // Typo in table name!

// ✅ Drizzle - Full IDE support
await db.insert(quizzes).values({
  title: "Math Quiz",
  subject: "Mathematics",
  difficulty: "Beginner", // ✨ Autocomplete suggests: "Beginner" | "Intermediate" | "Advanced"
  timeLimit: 20,
  questionCount: 5,
});
```

---

## 🔄 Migration Strategy

### **Phase 1: Parallel Implementation** (Current)

- ✅ Keep existing raw SQL system
- ✅ Add Drizzle ORM alongside
- ✅ Test both systems in parallel

### **Phase 2: Gradual Migration** (Next)

- 🔄 Update one component at a time to use Drizzle
- 🔄 A/B test performance differences
- 🔄 Ensure feature parity

### **Phase 3: Complete Migration** (Future)

- 🔄 Remove raw SQL implementation
- 🔄 Clean up legacy files
- 🔄 Update documentation

---

## 🧪 How to Test Drizzle ORM

### **1. Run the Test Script**

```bash
npm run test:drizzle
```

### **2. Test in Debug Tab**

Update your Debug tab to include Drizzle testing:

```typescript
// Add to src/app/(tabs)/debug.tsx
<TouchableOpacity
  className="bg-purple-500 p-4 rounded-xl mb-4"
  onPress={async () => {
    try {
      const drizzleQuizService = await import("../../lib/drizzleQuizService");
      await drizzleQuizService.default.createSampleQuizzes();
      console.log("✅ Drizzle sample quizzes created!");
    } catch (error) {
      console.error("❌ Drizzle test failed:", error);
    }
  }}
>
  <Text className="text-white font-semibold text-center text-lg">
    🧪 Test Drizzle ORM
  </Text>
</TouchableOpacity>
```

### **3. Performance Comparison**

```typescript
// Test both implementations
const startTime = Date.now();

// Test raw SQL
await quizService.getQuizzesBySubject("Mathematics");
const rawSqlTime = Date.now() - startTime;

// Test Drizzle
const drizzleStart = Date.now();
await drizzleQuizService.getQuizzesBySubject("Mathematics");
const drizzleTime = Date.now() - drizzleStart;

console.log(`Raw SQL: ${rawSqlTime}ms, Drizzle: ${drizzleTime}ms`);
```

---

## 📝 Example Usage Patterns

### **Creating a Quiz**

```typescript
// Old way
const quizId = await database.createQuiz({
  title: "Advanced Calculus",
  description: "Complex calculus problems",
  subject: "Mathematics",
  difficulty: "Advanced",
  timeLimit: 30,
  questionCount: 10,
});

// New way
const quiz = await drizzleQuizService.createQuiz({
  title: "Advanced Calculus",
  description: "Complex calculus problems",
  subject: "Mathematics",
  difficulty: "Advanced", // ✨ Type-checked enum
  timeLimit: 30,
  questionCount: 10,
});
```

### **Querying with Relations**

```typescript
// Old way - Multiple queries
const quiz = await database.getQuizWithQuestions(quizId);

// New way - Single query with relations
const quiz = await drizzleQuizService.getQuizWithQuestions(quizId);
// ✨ Fully typed result with nested questions array
```

### **Complex Filtering**

```typescript
// Old way - String building
const quizzes = await db.getAllAsync(
  `
  SELECT q.*, COUNT(qa.id) as attempts
  FROM quizzes q
  LEFT JOIN quizAttempts qa ON q.id = qa.quizId
  WHERE q.subject = ? AND q.difficulty = ?
  GROUP BY q.id
  HAVING attempts > ?
`,
  [subject, difficulty, minAttempts],
);

// New way - Composable query
const quizzes = await db
  .select({
    ...quizzes,
    attempts: count(quizAttempts.id),
  })
  .from(quizzes)
  .leftJoin(quizAttempts, eq(quizzes.id, quizAttempts.quizId))
  .where(and(eq(quizzes.subject, subject), eq(quizzes.difficulty, difficulty)))
  .groupBy(quizzes.id)
  .having(gt(count(quizAttempts.id), minAttempts));
```

---

## 🚀 Next Steps

1. **Try the new system**: Use the Debug tab to test Drizzle ORM
2. **Compare performance**: Run both systems side by side
3. **Update one component**: Pick a simple component to migrate first
4. **Provide feedback**: Let us know how Drizzle compares to raw SQL

---

## 📚 Resources

- **[Drizzle ORM Docs](https://orm.drizzle.team/)**
- **[Expo SQLite Integration](https://orm.drizzle.team/docs/connect-react-native-sqlite)**
- **[TypeScript Best Practices](https://orm.drizzle.team/docs/typescript)**

---

_Drizzle ORM: Type-safe, lightweight, and developer-friendly database interactions for React Native!_ 🎯
