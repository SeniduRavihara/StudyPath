import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import drizzleQuizService from "../../../lib/drizzleQuizService";
import type { Quiz } from "../../../lib/schema";

export default function QuizzesScreen() {
  const router = useRouter();
  const { subject, topic } = useLocalSearchParams();
  const parsedSubject = JSON.parse(subject as string);
  const parsedTopic = JSON.parse(topic as string);

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  // Add isImported property to Quiz type for this component
  interface QuizWithImport extends Quiz {
    isImported: boolean | null;
  }

  useEffect(() => {
    loadQuizzes();
  }, []);

  // Debug: Log database info
  useEffect(() => {
    const logDbInfo = async () => {
      try {
        const stats = await drizzleQuizService.getDatabaseStats();
        console.log("📊 Drizzle Database Stats:", stats);
      } catch (error) {
        console.error("Error logging database info:", error);
      }
    };
    logDbInfo();
  }, [quizzes]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const subjectQuizzes = await drizzleQuizService.getQuizzesBySubject(
        parsedSubject.name,
      );

      // Add import status checking
      const quizzesWithImport = subjectQuizzes.map(quiz => ({
        ...quiz,
        isImported: quiz.isImported || false,
      }));

      setQuizzes(quizzesWithImport);
    } catch (error) {
      console.error("Error loading quizzes:", error);
      // If no quizzes exist, create sample ones
      try {
        await drizzleQuizService.createSampleQuizzes();
        const subjectQuizzes = await drizzleQuizService.getQuizzesBySubject(
          parsedSubject.name,
        );

        // Add import status checking
        const quizzesWithImport = subjectQuizzes.map(quiz => ({
          ...quiz,
          isImported: quiz.isImported || false,
        }));

        setQuizzes(quizzesWithImport);
      } catch (createError) {
        console.error("Error creating sample quizzes:", createError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuizPress = (quiz: Quiz) => {
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

  const startQuiz = (quiz: Quiz) => {
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

  const getDifficultyColor = (difficulty: Quiz["difficulty"]): string => {
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

  const handleRemoveImportedQuiz = async (quizId: number) => {
    Alert.alert(
      "Remove Quiz",
      "Are you sure you want to remove this imported quiz?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              // Remove from SQLite database using the correct method
              await drizzleQuizService.removeImportedQuiz(quizId);
              // Refresh quizzes
              loadQuizzes();
            } catch (error) {
              console.error("Error removing imported quiz:", error);
              Alert.alert("Error", "Failed to remove quiz");
            }
          },
        },
      ],
    );
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
              {quizzes.length}
            </Text>
            <Text className="text-white opacity-80 text-sm">Available</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">
              {quizzes.reduce((sum, quiz) => sum + quiz.questionCount, 0)}
            </Text>
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

        {loading ? (
          <View className="items-center py-8">
            <Text className="text-white text-lg">Loading quizzes...</Text>
          </View>
        ) : quizzes.length === 0 ? (
          <View className="items-center py-8">
            <Text className="text-white text-lg">No quizzes available</Text>
          </View>
        ) : (
          quizzes.map(quiz => {
            const quizWithImport = quiz as QuizWithImport;
            return (
              <View key={quiz.id} className="mb-4">
                <LinearGradient
                  colors={["#1a1a2e", "#16213e"]}
                  className="p-6 rounded-3xl"
                >
                  <View className="flex-row items-center">
                    <View
                      className={`p-4 rounded-2xl mr-4 ${
                        quizWithImport.isImported
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                    >
                      <Ionicons
                        name={
                          quizWithImport.isImported ? "download" : "help-circle"
                        }
                        size={28}
                        color="white"
                      />
                    </View>
                    <View className="flex-1">
                      <View className="mb-2">
                        <View className="flex-row justify-between items-start mb-1">
                          <Text
                            className="text-white text-lg font-bold flex-1 mr-2"
                            numberOfLines={2}
                            ellipsizeMode="tail"
                          >
                            {quiz.title}
                          </Text>
                          <View className="flex-row items-center flex-shrink-0">
                            <View
                              className="px-3 py-1 rounded-full mr-2"
                              style={{
                                backgroundColor: getDifficultyColor(
                                  quiz.difficulty,
                                ),
                              }}
                            >
                              <Text className="text-white text-xs font-semibold">
                                {quiz.difficulty}
                              </Text>
                            </View>
                            {quizWithImport.isImported && (
                              <View className="bg-green-500/20 px-2 py-1 rounded-full">
                                <Text className="text-green-400 text-xs font-semibold">
                                  Imported
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                      <Text
                        className="text-gray-400 text-sm mb-3"
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {quiz.description}
                      </Text>
                      <View className="flex-row justify-between items-center mb-3">
                        <Text
                          className="text-gray-400 text-sm flex-1 mr-2"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {quiz.questionCount} questions • {quiz.timeLimit} min
                        </Text>
                        {quizWithImport.isImported && (
                          <TouchableOpacity
                            className="bg-red-500/20 p-2 rounded-full flex-shrink-0"
                            onPress={() => handleRemoveImportedQuiz(quiz.id)}
                          >
                            <Ionicons name="close" size={16} color="#ef4444" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <View className="flex-shrink-0 ml-2">
                      {quizWithImport.isImported ? (
                        <TouchableOpacity onPress={() => handleQuizPress(quiz)}>
                          <Ionicons
                            name="play-circle"
                            size={24}
                            color="#10b981"
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={() => handleQuizPress(quiz)}>
                          <Ionicons
                            name="chevron-forward"
                            size={24}
                            color="#6b7280"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </LinearGradient>
              </View>
            );
          })
        )}
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
                {quizzes.length}
              </Text>
              <Text className="text-gray-400 text-sm">Available</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-400">
                {quizzes.reduce((sum, quiz) => sum + quiz.questionCount, 0)}
              </Text>
              <Text className="text-gray-400 text-sm">Questions</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-yellow-400">85%</Text>
              <Text className="text-gray-400 text-sm">Success Rate</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View className="h-24" />
    </ScrollView>
  );
}
