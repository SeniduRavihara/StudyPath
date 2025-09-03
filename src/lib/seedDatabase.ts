import { database, initDatabase } from "./database";

export const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Initialize database first
    await initDatabase();

    // Clear existing data (optional)
    await database.clearAllData();

    // Create Mathematics Quiz
    console.log("📊 Creating Mathematics quiz...");
    const mathQuizId = await database.createQuiz({
      title: "Basic Calculus",
      description:
        "Fundamental concepts of calculus including derivatives and integrals",
      subject: "Mathematics",
      difficulty: "Intermediate",
      timeLimit: 20,
      questionCount: 5,
    });

    // Add Mathematics questions
    await database.addQuestion({
      quizId: mathQuizId,
      question: "What is the derivative of x²?",
      optionA: "x",
      optionB: "2x",
      optionC: "x²",
      optionD: "2x²",
      correctAnswer: "B",
      explanation: "The derivative of x² is 2x using the power rule.",
      questionOrder: 1,
    });

    await database.addQuestion({
      quizId: mathQuizId,
      question: "Which of the following is a quadratic equation?",
      optionA: "x + 2 = 0",
      optionB: "x² + 3x + 1 = 0",
      optionC: "x³ + x = 0",
      optionD: "2x + 1 = 0",
      correctAnswer: "B",
      explanation: "A quadratic equation has the form ax² + bx + c = 0.",
      questionOrder: 2,
    });

    await database.addQuestion({
      quizId: mathQuizId,
      question: "What is the slope of a horizontal line?",
      optionA: "0",
      optionB: "1",
      optionC: "undefined",
      optionD: "-1",
      correctAnswer: "A",
      explanation: "A horizontal line has a slope of 0.",
      questionOrder: 3,
    });

    await database.addQuestion({
      quizId: mathQuizId,
      question: "Solve for x: 2x + 5 = 13",
      optionA: "x = 4",
      optionB: "x = 8",
      optionC: "x = 6",
      optionD: "x = 9",
      correctAnswer: "A",
      explanation: "2x + 5 = 13 → 2x = 8 → x = 4",
      questionOrder: 4,
    });

    await database.addQuestion({
      quizId: mathQuizId,
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
    console.log("⚛️ Creating Physics quiz...");
    const physicsQuizId = await database.createQuiz({
      title: "Mechanics Fundamentals",
      description: "Basic principles of classical mechanics",
      subject: "Physics",
      difficulty: "Beginner",
      timeLimit: 15,
      questionCount: 3,
    });

    // Add Physics questions
    await database.addQuestion({
      quizId: physicsQuizId,
      question: "What is the SI unit of force?",
      optionA: "Joule",
      optionB: "Newton",
      optionC: "Watt",
      optionD: "Pascal",
      correctAnswer: "B",
      explanation: "The SI unit of force is the Newton (N).",
      questionOrder: 1,
    });

    await database.addQuestion({
      quizId: physicsQuizId,
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

    await database.addQuestion({
      quizId: physicsQuizId,
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

    // Create Chemistry Quiz
    console.log("🧪 Creating Chemistry quiz...");
    const chemistryQuizId = await database.createQuiz({
      title: "Atomic Structure",
      description: "Basic concepts of atomic structure and periodic table",
      subject: "Chemistry",
      difficulty: "Beginner",
      timeLimit: 12,
      questionCount: 3,
    });

    await database.addQuestion({
      quizId: chemistryQuizId,
      question: "What is the atomic number of Carbon?",
      optionA: "4",
      optionB: "6",
      optionC: "8",
      optionD: "12",
      correctAnswer: "B",
      explanation: "Carbon has 6 protons, so its atomic number is 6.",
      questionOrder: 1,
    });

    await database.addQuestion({
      quizId: chemistryQuizId,
      question: "Which gas makes up about 78% of Earth's atmosphere?",
      optionA: "Oxygen",
      optionB: "Carbon Dioxide",
      optionC: "Nitrogen",
      optionD: "Argon",
      correctAnswer: "C",
      explanation: "Nitrogen (N₂) makes up about 78% of Earth's atmosphere.",
      questionOrder: 2,
    });

    await database.addQuestion({
      quizId: chemistryQuizId,
      question: "What is the chemical symbol for Gold?",
      optionA: "Go",
      optionB: "Gd",
      optionC: "Au",
      optionD: "Ag",
      correctAnswer: "C",
      explanation: "Gold's chemical symbol is Au, from the Latin word 'aurum'.",
      questionOrder: 3,
    });

    // Create Biology Quiz
    console.log("🧬 Creating Biology quiz...");
    const biologyQuizId = await database.createQuiz({
      title: "Cell Biology Basics",
      description: "Introduction to cell structure and function",
      subject: "Biology",
      difficulty: "Beginner",
      timeLimit: 10,
      questionCount: 3,
    });

    await database.addQuestion({
      quizId: biologyQuizId,
      question: "What is the powerhouse of the cell?",
      optionA: "Nucleus",
      optionB: "Mitochondria",
      optionC: "Ribosome",
      optionD: "Chloroplast",
      correctAnswer: "B",
      explanation:
        "Mitochondria are called the powerhouse of the cell because they produce ATP energy.",
      questionOrder: 1,
    });

    await database.addQuestion({
      quizId: biologyQuizId,
      question: "What process do plants use to make food?",
      optionA: "Respiration",
      optionB: "Photosynthesis",
      optionC: "Digestion",
      optionD: "Fermentation",
      correctAnswer: "B",
      explanation:
        "Plants use photosynthesis to convert sunlight, water, and CO₂ into glucose.",
      questionOrder: 2,
    });

    await database.addQuestion({
      quizId: biologyQuizId,
      question: "What is DNA short for?",
      optionA: "Deoxyribonucleic Acid",
      optionB: "Deoxyribose Nucleic Acid",
      optionC: "Dioxynucleic Acid",
      optionD: "Diribonucleic Acid",
      correctAnswer: "A",
      explanation: "DNA stands for Deoxyribonucleic Acid.",
      questionOrder: 3,
    });

    // Show database statistics
    await database.getTableInfo();

    console.log("🎉 Database seeding completed successfully!");

    return {
      success: true,
      message:
        "Database seeded with sample quizzes for Mathematics, Physics, Chemistry, and Biology",
      quizzes: {
        mathematics: mathQuizId,
        physics: physicsQuizId,
        chemistry: chemistryQuizId,
        biology: biologyQuizId,
      },
    };
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};

export default seedDatabase;
