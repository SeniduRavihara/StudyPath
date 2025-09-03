import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

type QuizTopic = {
  id: number;
  title: string;
  description: string;
  questionCount: number;
  timeLimit: number; // in minutes
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  completed: number;
  total: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: [string, string];
};

export default function QuizzesScreen() {
  const router = useRouter();
  const { subject, topic } = useLocalSearchParams();
  const parsedSubject = JSON.parse(subject as string);
  const parsedTopic = JSON.parse(topic as string);

  const [selectedQuiz, setSelectedQuiz] = useState<QuizTopic | null>(null);

  const quizTopics: QuizTopic[] = [
    {
      id: 1,
      title: "Basic Concepts",
      description: "Fundamental principles and definitions",
      questionCount: 10,
      timeLimit: 15,
      difficulty: "Beginner",
      completed: 3,
      total: 5,
      icon: "bulb",
      color: ["#10b981", "#059669"],
    },
    {
      id: 2,
      title: "Problem Solving",
      description: "Apply concepts to solve problems",
      questionCount: 15,
      timeLimit: 25,
      difficulty: "Intermediate",
      completed: 2,
      total: 8,
      icon: "calculator",
      color: ["#f59e0b", "#d97706"],
    },
    {
      id: 3,
      title: "Advanced Applications",
      description: "Complex scenarios and real-world applications",
      questionCount: 20,
      timeLimit: 35,
      difficulty: "Advanced",
      completed: 1,
      total: 12,
      icon: "rocket",
      color: ["#ef4444", "#dc2626"],
    },
    {
      id: 4,
      title: "Mixed Review",
      description: "Comprehensive review of all topics",
      questionCount: 25,
      timeLimit: 45,
      difficulty: "Intermediate",
      completed: 0,
      total: 6,
      icon: "refresh",
      color: ["#8b5cf6", "#7c3aed"],
    },
  ];

  const handleQuizPress = (quiz: QuizTopic) => {
    setSelectedQuiz(quiz);
    Alert.alert(
      `Start ${quiz.title}`,
      `This quiz has ${quiz.questionCount} questions and a ${quiz.timeLimit} minute time limit. Are you ready to begin?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Start Quiz",
          onPress: () => startQuiz(quiz),
        },
      ],
    );
  };

  const startQuiz = (quiz: QuizTopic) => {
    // Navigate to the actual quiz taking screen
    router.push({
      pathname: "/study/take-quiz",
      params: {
        subject: JSON.stringify(parsedSubject),
        topic: JSON.stringify(parsedTopic),
        quiz: JSON.stringify(quiz),
      },
    });
  };

  const getDifficultyColor = (difficulty: QuizTopic["difficulty"]): string => {
    switch (difficulty) {
      case "Beginner":
        return "#10b981";
      case "Intermediate":
        return "#f59e0b";
      case "Advanced":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-900">
      {/* Header */}
      <LinearGradient colors={parsedSubject.color} className="px-6 pt-14 pb-8">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white bg-opacity-20 p-2 rounded-full mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">
              {parsedTopic.title}
            </Text>
            <Text className="text-white opacity-80">Test your knowledge</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="bg-white bg-opacity-30 rounded-full h-3 mb-4">
          <View
            className="bg-white rounded-full h-3"
            style={{
              width: `${(parsedTopic.completed / parsedTopic.count) * 100}%`,
            }}
          />
        </View>

        {/* Stats */}
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">
              {quizTopics.length}
            </Text>
            <Text className="text-white opacity-80 text-sm">Quiz Topics</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">70</Text>
            <Text className="text-white opacity-80 text-sm">Questions</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">2.1k</Text>
            <Text className="text-white opacity-80 text-sm">Points</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quiz Topics */}
      <View className="px-6 mt-8">
        <Text className="text-white text-xl font-bold mb-6">
          Available Quizzes
        </Text>

        {quizTopics.map(quiz => (
          <TouchableOpacity
            key={quiz.id}
            className="mb-4"
            onPress={() => handleQuizPress(quiz)}
          >
            <LinearGradient
              colors={["#1a1a2e", "#16213e"]}
              className="p-6 rounded-3xl"
            >
              <View className="flex-row items-center">
                <LinearGradient
                  colors={quiz.color}
                  className="p-4 rounded-2xl mr-4"
                >
                  <Ionicons name={quiz.icon} size={28} color="white" />
                </LinearGradient>

                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white text-lg font-bold">
                      {quiz.title}
                    </Text>
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: getDifficultyColor(quiz.difficulty),
                      }}
                    >
                      <Text className="text-white text-xs font-semibold">
                        {quiz.difficulty}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-gray-400 text-sm mb-3">
                    {quiz.description}
                  </Text>

                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-gray-400 text-sm">
                      {quiz.questionCount} questions • {quiz.timeLimit} min
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      {quiz.completed}/{quiz.total} completed
                    </Text>
                  </View>

                  {/* Progress Bar */}
                  <View className="bg-slate-700 rounded-full h-2">
                    <LinearGradient
                      colors={quiz.color}
                      className="rounded-full h-2"
                      style={{
                        width: `${(quiz.completed / quiz.total) * 100}%`,
                      }}
                    />
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={24} color="#6b7280" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Stats */}
      <View className="px-6 mt-6">
        <LinearGradient
          colors={["#1a1a2e", "#16213e"]}
          className="p-6 rounded-3xl"
        >
          <Text className="text-white text-lg font-bold mb-4 text-center">
            Quiz Performance
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-400">
                {quizTopics.reduce((sum, quiz) => sum + quiz.completed, 0)}
              </Text>
              <Text className="text-gray-400 text-sm">Completed</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-400">
                {quizTopics.reduce((sum, quiz) => sum + quiz.total, 0)}
              </Text>
              <Text className="text-gray-400 text-sm">Total</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-yellow-400">85%</Text>
              <Text className="text-gray-400 text-sm">Success Rate</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
