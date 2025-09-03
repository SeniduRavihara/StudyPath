import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import quizService from "../../../lib/quizService";

type Question = {
  id: number;
  quizId: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string; // 'A', 'B', 'C', or 'D'
  explanation?: string;
  questionOrder: number;
};

type QuizResult = {
  score: number;
  totalQuestions: number;
  timeTaken: number;
  correctAnswers: number;
  wrongAnswers: number;
};

export default function TakeQuizScreen() {
  const router = useRouter();
  const { subject, topic, quiz } = useLocalSearchParams();
  const parsedSubject = JSON.parse(subject as string);
  // const parsedTopic = JSON.parse(topic as string); // Not used currently
  const parsedQuiz = JSON.parse(quiz as string);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(parsedQuiz.timeLimit * 60); // Convert to seconds
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Load questions from database
  useEffect(() => {
    loadQuizQuestions();
  }, [loadQuizQuestions]);

  const loadQuizQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const quizWithQuestions = await quizService.getQuizWithQuestions(
        parsedQuiz.id,
      );
      setQuestions(quizWithQuestions.questions);
    } catch (error) {
      console.error("Error loading quiz questions:", error);
      // Fallback to sample questions if database fails
      setQuestions([
        {
          id: 1,
          quizId: parsedQuiz.id,
          question: "What is the derivative of x²?",
          optionA: "x",
          optionB: "2x",
          optionC: "x²",
          optionD: "2x²",
          correctAnswer: "B",
          explanation: "The derivative of x² is 2x using the power rule.",
          questionOrder: 1,
        },
        {
          id: 2,
          quizId: parsedQuiz.id,
          question: "Which of the following is a quadratic equation?",
          optionA: "x + 2 = 0",
          optionB: "x² + 3x + 1 = 0",
          optionC: "x³ + x = 0",
          optionD: "2x + 1 = 0",
          correctAnswer: "B",
          explanation: "A quadratic equation has the form ax² + bx + c = 0.",
          questionOrder: 2,
        },
        {
          id: 3,
          quizId: parsedQuiz.id,
          question: "What is the slope of a horizontal line?",
          optionA: "0",
          optionB: "1",
          optionC: "undefined",
          optionD: "-1",
          correctAnswer: "A",
          explanation: "A horizontal line has a slope of 0.",
          questionOrder: 3,
        },
        {
          id: 4,
          quizId: parsedQuiz.id,
          question: "Solve for x: 2x + 5 = 13",
          optionA: "x = 4",
          optionB: "x = 8",
          optionC: "x = 6",
          optionD: "x = 9",
          correctAnswer: "A",
          explanation: "2x + 5 = 13 → 2x = 8 → x = 4",
          questionOrder: 4,
        },
        {
          id: 5,
          quizId: parsedQuiz.id,
          question: "What is the area of a circle with radius 3?",
          optionA: "6π",
          optionB: "9π",
          optionC: "12π",
          optionD: "18π",
          correctAnswer: "B",
          explanation: "Area = πr² = π(3)² = 9π",
          questionOrder: 5,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [parsedQuiz.id]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isQuizComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isQuizComplete) {
      completeQuiz();
    }
  }, [timeLeft, isQuizComplete, completeQuiz]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      Alert.alert(
        "Please select an answer",
        "You must choose an answer before continuing.",
      );
      return;
    }

    // Save the answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);

    // Move to next question or complete quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = useCallback(async () => {
    try {
      // Save quiz attempt to database
      const results = calculateResults();
      await quizService.saveQuizAttempt({
        quizId: parsedQuiz.id,
        userId: "user123", // Replace with actual user ID from auth context
        score: results.score,
        timeTaken: parsedQuiz.timeLimit * 60 - timeLeft,
        answers: JSON.stringify(answers),
      });

      // Update user progress
      await quizService.calculateAndUpdateProgress(
        "user123", // Replace with actual user ID from auth context
        parsedSubject.name,
        results.score,
      );

      setIsQuizComplete(true);
      setShowResults(true);
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
      // Still show results even if saving fails
      setIsQuizComplete(true);
      setShowResults(true);
    }
  }, [answers, parsedQuiz.id, parsedSubject.name, questions, timeLeft]);

  const calculateResults = (): QuizResult => {
    let correctAnswers = 0;
    answers.forEach((answerIndex, questionIndex) => {
      const question = questions[questionIndex];
      const selectedOption = ["A", "B", "C", "D"][answerIndex];
      if (selectedOption === question.correctAnswer) {
        correctAnswers++;
      }
    });

    return {
      score: Math.round((correctAnswers / questions.length) * 100),
      totalQuestions: questions.length,
      timeTaken: parsedQuiz.timeLimit * 60 - timeLeft,
      correctAnswers,
      wrongAnswers: questions.length - correctAnswers,
    };
  };

  // Removed unused handleFinishQuiz function

  if (showResults) {
    const results = calculateResults();
    return (
      <View className="flex-1 bg-slate-900">
        <LinearGradient
          colors={["#0f0f23", "#1a1a2e", "#16213e"]}
          className="flex-1"
        >
          {/* Header */}
          <View className="px-6 pt-14 pb-6">
            <View className="flex-row items-center mb-4">
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-white bg-opacity-20 p-2 rounded-full mr-4"
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold">
                  Quiz Results
                </Text>
                <Text className="text-white opacity-80">How did you do?</Text>
              </View>
            </View>
          </View>

          {/* Results Content */}
          <ScrollView className="flex-1 px-6">
            <View className="items-center mb-8">
              <View className="bg-slate-800 p-8 rounded-3xl items-center mb-6 border border-slate-700">
                <Text className="text-white text-5xl font-bold mb-2">
                  {results.score}%
                </Text>
                <Text className="text-gray-300 text-lg">Your Score</Text>
              </View>

              {/* Performance Badge */}
              <View className="bg-slate-800 px-6 py-3 rounded-full mb-6 border border-slate-700">
                <Text className="text-white text-lg font-semibold">
                  {results.score >= 80
                    ? "🏆 Excellent Performance!"
                    : results.score >= 60
                      ? "👍 Good Job!"
                      : "📚 Keep Learning!"}
                </Text>
              </View>
            </View>

            {/* Stats Cards */}
            <View className="mb-8">
              <View className="bg-slate-800 p-4 rounded-2xl border border-slate-700 mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-300 text-lg">Correct Answers</Text>
                  <Text className="text-white font-bold text-xl">
                    {results.correctAnswers}/{results.totalQuestions}
                  </Text>
                </View>
                <View className="bg-slate-700 rounded-full h-2">
                  <View
                    className="bg-green-400 rounded-full h-2"
                    style={{
                      width: `${(results.correctAnswers / results.totalQuestions) * 100}%`,
                    }}
                  />
                </View>
              </View>

              <View className="bg-slate-800 p-4 rounded-2xl border border-slate-700 mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-300 text-lg">Time Taken</Text>
                  <Text className="text-white font-bold text-xl">
                    {formatTime(results.timeTaken)}
                  </Text>
                </View>
                <View className="bg-slate-700 rounded-full h-2">
                  <View
                    className="bg-blue-400 rounded-full h-2"
                    style={{
                      width: `${((parsedQuiz.timeLimit * 60 - results.timeTaken) / (parsedQuiz.timeLimit * 60)) * 100}%`,
                    }}
                  />
                </View>
              </View>

              <View className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-300 text-lg">Accuracy</Text>
                  <Text className="text-white font-bold text-xl">
                    {Math.round(
                      (results.correctAnswers / results.totalQuestions) * 100,
                    )}
                    %
                  </Text>
                </View>
                <View className="bg-slate-700 rounded-full h-2">
                  <View
                    className="bg-yellow-400 rounded-full h-2"
                    style={{
                      width: `${(results.correctAnswers / results.totalQuestions) * 100}%`,
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="mb-8">
              <TouchableOpacity
                className="bg-slate-800 p-4 rounded-2xl items-center border border-slate-700 mb-4"
                onPress={() => setShowResults(false)}
              >
                <Text className="text-white font-semibold text-lg">
                  🔍 Review Answers
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-blue-600 p-4 rounded-2xl items-center"
                onPress={() => router.back()}
              >
                <Text className="text-white font-semibold text-lg">
                  📚 Back to Quizzes
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 bg-slate-900">
        <LinearGradient colors={parsedSubject.color} className="flex-1">
          <View className="flex-1 justify-center items-center px-6">
            <Text className="text-white text-2xl font-bold mb-4">
              Loading Quiz...
            </Text>
            <Text className="text-white opacity-80">
              Please wait while we prepare your questions
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View className="flex-1 bg-slate-900">
        <LinearGradient colors={parsedSubject.color} className="flex-1">
          <View className="flex-1 justify-center items-center px-6">
            <Text className="text-white text-2xl font-bold mb-4">
              No Questions Available
            </Text>
            <Text className="text-white opacity-80">
              This quiz doesn't have any questions yet
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Show loading state if questions haven't loaded yet
  if (loading || !currentQuestion) {
    return (
      <View className="flex-1 bg-slate-900 justify-center items-center">
        <Text className="text-white text-lg">Loading quiz...</Text>
      </View>
    );
  }

  // Show error state if no questions available
  if (questions.length === 0) {
    return (
      <View className="flex-1 bg-slate-900 justify-center items-center px-6">
        <Text className="text-white text-xl font-bold mb-4">
          No Questions Available
        </Text>
        <Text className="text-gray-400 text-center mb-6">
          This quiz doesn't have any questions yet.
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-2xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-900">
      {/* Header */}
      <LinearGradient colors={parsedSubject.color} className="px-6 pt-14 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white bg-opacity-20 p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-white text-lg font-bold">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
            <Text className="text-white opacity-80 text-sm">
              {parsedQuiz.title}
            </Text>
          </View>
          <View className="bg-white bg-opacity-20 px-3 py-2 rounded-full">
            <Text className="text-white font-bold">{formatTime(timeLeft)}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="bg-white bg-opacity-30 rounded-full h-2">
          <View
            className="bg-white rounded-full h-2"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </View>
      </LinearGradient>

      {/* Question */}
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="bg-slate-800 rounded-3xl p-6 mb-6">
          <Text className="text-white text-lg font-semibold mb-4">
            {currentQuestion.question}
          </Text>
        </View>

        {/* Answer Options */}
        <View className="mb-8">
          {[
            currentQuestion.optionA,
            currentQuestion.optionB,
            currentQuestion.optionC,
            currentQuestion.optionD,
          ].map((option, index) => (
            <TouchableOpacity
              key={index}
              className={`p-4 rounded-2xl border-2 mb-4 ${
                selectedAnswer === index
                  ? "border-blue-400 bg-blue-400 bg-opacity-20"
                  : "border-slate-700 bg-slate-800"
              }`}
              onPress={() => handleAnswerSelect(index)}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${
                    selectedAnswer === index
                      ? "border-blue-400 bg-blue-400"
                      : "border-slate-600"
                  }`}
                >
                  {selectedAnswer === index && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-white text-base flex-1">{option}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row justify-between mb-8">
          <TouchableOpacity
            className={`px-6 py-3 rounded-full ${
              currentQuestionIndex === 0
                ? "bg-slate-700 opacity-50"
                : "bg-slate-700"
            }`}
            onPress={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
                setSelectedAnswer(answers[currentQuestionIndex - 1] || null);
              }
            }}
            disabled={currentQuestionIndex === 0}
          >
            <Text className="text-white font-semibold">Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-full"
            onPress={handleNextQuestion}
          >
            <Text className="text-white font-semibold">
              {currentQuestionIndex === questions.length - 1
                ? "Finish"
                : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
