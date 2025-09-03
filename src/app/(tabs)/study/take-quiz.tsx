import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
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
  const parsedTopic = JSON.parse(topic as string);
  const parsedQuiz = JSON.parse(quiz as string);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(parsedQuiz.timeLimit * 60); // Convert to seconds
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Sample questions - in a real app, these would come from your database
  const questions: Question[] = [
    {
      id: 1,
      question: "What is the derivative of x²?",
      options: ["x", "2x", "x²", "2x²"],
      correctAnswer: 1,
      explanation: "The derivative of x² is 2x using the power rule.",
    },
    {
      id: 2,
      question: "Which of the following is a quadratic equation?",
      options: ["x + 2 = 0", "x² + 3x + 1 = 0", "x³ + x = 0", "2x + 1 = 0"],
      correctAnswer: 1,
      explanation: "A quadratic equation has the form ax² + bx + c = 0.",
    },
    {
      id: 3,
      question: "What is the slope of a horizontal line?",
      options: ["0", "1", "undefined", "-1"],
      correctAnswer: 0,
      explanation: "A horizontal line has a slope of 0.",
    },
    {
      id: 4,
      question: "Solve for x: 2x + 5 = 13",
      options: ["x = 4", "x = 8", "x = 6", "x = 9"],
      correctAnswer: 0,
      explanation: "2x + 5 = 13 → 2x = 8 → x = 4",
    },
    {
      id: 5,
      question: "What is the area of a circle with radius 3?",
      options: ["6π", "9π", "12π", "18π"],
      correctAnswer: 1,
      explanation: "Area = πr² = π(3)² = 9π",
    },
  ];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isQuizComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isQuizComplete) {
      completeQuiz();
    }
  }, [timeLeft, isQuizComplete]);

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

  const completeQuiz = () => {
    setIsQuizComplete(true);
    setShowResults(true);
  };

  const calculateResults = (): QuizResult => {
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
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

  const handleFinishQuiz = () => {
    Alert.alert("Quiz Complete!", "Great job! You've completed the quiz.", [
      {
        text: "Review Results",
        onPress: () => setShowResults(true),
      },
      {
        text: "Back to Quizzes",
        onPress: () => router.back(),
      },
    ]);
  };

  if (showResults) {
    const results = calculateResults();
    return (
      <View className="flex-1 bg-slate-900">
        <LinearGradient colors={parsedSubject.color} className="flex-1">
          {/* Header */}
          <View className="px-6 pt-14 pb-6">
            <View className="flex-row items-center justify-center mb-4">
              <TouchableOpacity
                onPress={() => router.back()}
                className="absolute left-0 bg-white bg-opacity-20 p-2 rounded-full"
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-white text-2xl font-bold">
                Quiz Results
              </Text>
            </View>
          </View>

          {/* Results Content */}
          <ScrollView className="flex-1 px-6">
            <View className="items-center mb-8">
              <View className="bg-white bg-opacity-20 p-8 rounded-3xl items-center mb-6">
                <Text className="text-white text-4xl font-bold mb-2">
                  {results.score}%
                </Text>
                <Text className="text-white text-lg opacity-90">
                  Your Score
                </Text>
              </View>

              {/* Performance Badge */}
              <View className="bg-white bg-opacity-20 px-6 py-3 rounded-full mb-6">
                <Text className="text-white text-lg font-semibold">
                  {results.score >= 80
                    ? "🏆 Excellent!"
                    : results.score >= 60
                      ? "👍 Good Job!"
                      : "📚 Keep Learning!"}
                </Text>
              </View>
            </View>

            {/* Stats Cards */}
            <View className="space-y-4 mb-8">
              <View className="bg-white bg-opacity-10 p-4 rounded-2xl">
                <View className="flex-row justify-between items-center">
                  <Text className="text-white opacity-80 text-lg">
                    Correct Answers
                  </Text>
                  <Text className="text-white font-bold text-xl">
                    {results.correctAnswers}/{results.totalQuestions}
                  </Text>
                </View>
                <View className="bg-slate-700 rounded-full h-2 mt-2">
                  <View
                    className="bg-green-400 rounded-full h-2"
                    style={{
                      width: `${(results.correctAnswers / results.totalQuestions) * 100}%`,
                    }}
                  />
                </View>
              </View>

              <View className="bg-white bg-opacity-10 p-4 rounded-2xl">
                <View className="flex-row justify-between items-center">
                  <Text className="text-white opacity-80 text-lg">
                    Time Taken
                  </Text>
                  <Text className="text-white font-bold text-xl">
                    {formatTime(results.timeTaken)}
                  </Text>
                </View>
                <View className="bg-slate-700 rounded-full h-2 mt-2">
                  <View
                    className="bg-blue-400 rounded-full h-2"
                    style={{
                      width: `${((parsedQuiz.timeLimit * 60 - results.timeTaken) / (parsedQuiz.timeLimit * 60)) * 100}%`,
                    }}
                  />
                </View>
              </View>

              <View className="bg-white bg-opacity-10 p-4 rounded-2xl">
                <View className="flex-row justify-between items-center">
                  <Text className="text-white opacity-80 text-lg">
                    Accuracy
                  </Text>
                  <Text className="text-white font-bold text-xl">
                    {Math.round(
                      (results.correctAnswers / results.totalQuestions) * 100,
                    )}
                    %
                  </Text>
                </View>
                <View className="bg-slate-700 rounded-full h-2 mt-2">
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
            <View className="space-y-4 mb-8">
              <TouchableOpacity
                className="bg-white bg-opacity-20 p-4 rounded-2xl items-center"
                onPress={() => setShowResults(false)}
              >
                <Text className="text-white font-semibold text-lg">
                  🔍 Review Answers
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-white p-4 rounded-2xl items-center"
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

  const currentQuestion = questions[currentQuestionIndex];

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
        <View className="space-y-4 mb-8">
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              className={`p-4 rounded-2xl border-2 ${
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
