import { database, initDatabase } from "./database";

export const testDatabase = async () => {
  try {
    console.log("🧪 Testing database setup...");

    // Initialize database
    await initDatabase();
    console.log("✅ Database initialized successfully");

    // Test creating a quiz
    const quizId = await database.createQuiz({
      title: "Test Quiz",
      description: "A test quiz to verify database functionality",
      subject: "Test",
      difficulty: "Beginner",
      timeLimit: 10,
      questionCount: 2,
    });
    console.log("✅ Quiz created with ID:", quizId);

    // Test adding questions
    const question1Id = await database.addQuestion({
      quizId,
      question: "What is 2 + 2?",
      optionA: "3",
      optionB: "4",
      optionC: "5",
      optionD: "6",
      correctAnswer: "B",
      explanation: "2 + 2 = 4",
      questionOrder: 1,
    });
    console.log("✅ Question 1 added with ID:", question1Id);

    const question2Id = await database.addQuestion({
      quizId,
      question: "What is the capital of France?",
      optionA: "London",
      optionB: "Berlin",
      optionC: "Paris",
      optionD: "Madrid",
      correctAnswer: "C",
      explanation: "Paris is the capital of France",
      questionOrder: 2,
    });
    console.log("✅ Question 2 added with ID:", question2Id);

    // Test retrieving quiz with questions
    const quizWithQuestions = await database.getQuizWithQuestions(quizId);
    console.log("✅ Quiz retrieved with questions:", quizWithQuestions);

    // Test saving quiz attempt
    const attemptId = await database.saveQuizAttempt({
      quizId,
      userId: "test-user",
      score: 100,
      timeTaken: 300,
      answers: JSON.stringify([0, 2]), // User answered A and C
    });
    console.log("✅ Quiz attempt saved with ID:", attemptId);

    // Test updating user progress
    await database.updateUserProgress("test-user", "Test", {
      totalQuizzes: 1,
      completedQuizzes: 1,
      totalScore: 100,
      averageScore: 100,
    });
    console.log("✅ User progress updated");

    // Test retrieving user progress
    const progress = await database.getUserProgress("test-user", "Test");
    console.log("✅ User progress retrieved:", progress);

    console.log("🎉 All database tests passed!");
    return true;
  } catch (error) {
    console.error("❌ Database test failed:", error);
    return false;
  }
};

export default testDatabase;
