import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { database, initDatabase } from "../lib/database";

export default function DatabaseViewer() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      await initDatabase();

      // Get all data from tables
      const allQuizzes = await database.getAllQuizzes();
      const allQuestions = await database.getAllQuestions();
      const allAttempts = await database.getAllAttempts();
      const allProgress = await database.getAllProgress();

      setQuizzes(allQuizzes);
      setQuestions(allQuestions);
      setAttempts(allAttempts);
      setProgress(allProgress);
    } catch (error) {
      console.error("Error loading database data:", error);
    }
  };

  const clearDatabase = async () => {
    Alert.alert("Clear Database", "Are you sure you want to clear all data?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          try {
            await database.clearAllData();
            await loadAllData();
            Alert.alert("Success", "Database cleared!");
          } catch (error) {
            Alert.alert("Error", "Failed to clear database");
          }
        },
      },
    ]);
  };

  const seedDatabase = async () => {
    try {
      const { seedDatabase } = await import("../lib/seedDatabase");
      await seedDatabase();
      await loadAllData();
      Alert.alert("Success", "Database seeded with sample data!");
    } catch (error) {
      Alert.alert("Error", "Failed to seed database");
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-900 p-4">
      <Text className="text-white text-2xl font-bold mb-4">
        Database Viewer
      </Text>

      {/* Controls */}
      <View className="flex-row gap-2 mb-6">
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded"
          onPress={loadAllData}
        >
          <Text className="text-white font-semibold">Refresh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-green-500 px-4 py-2 rounded"
          onPress={seedDatabase}
        >
          <Text className="text-white font-semibold">Seed DB</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-500 px-4 py-2 rounded"
          onPress={clearDatabase}
        >
          <Text className="text-white font-semibold">Clear DB</Text>
        </TouchableOpacity>
      </View>

      {/* Quizzes Table */}
      <View className="mb-6">
        <Text className="text-white text-xl font-bold mb-2">
          Quizzes ({quizzes.length})
        </Text>
        <View className="bg-slate-800 p-3 rounded">
          {quizzes.length === 0 ? (
            <Text className="text-gray-400">No quizzes found</Text>
          ) : (
            quizzes.map(quiz => (
              <View key={quiz.id} className="mb-2 p-2 bg-slate-700 rounded">
                <Text className="text-white font-semibold">{quiz.title}</Text>
                <Text className="text-gray-400 text-sm">
                  Subject: {quiz.subject} | Difficulty: {quiz.difficulty}
                </Text>
                <Text className="text-gray-400 text-sm">
                  Questions: {quiz.questionCount} | Time: {quiz.timeLimit}min
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Questions Table */}
      <View className="mb-6">
        <Text className="text-white text-xl font-bold mb-2">
          Questions ({questions.length})
        </Text>
        <View className="bg-slate-800 p-3 rounded">
          {questions.length === 0 ? (
            <Text className="text-gray-400">No questions found</Text>
          ) : (
            questions.slice(0, 5).map(question => (
              <View key={question.id} className="mb-2 p-2 bg-slate-700 rounded">
                <Text className="text-white font-semibold">
                  Quiz {question.quizId}: {question.question}
                </Text>
                <Text className="text-green-400 text-sm">
                  Answer: {question.correctAnswer}
                </Text>
              </View>
            ))
          )}
          {questions.length > 5 && (
            <Text className="text-gray-400 text-sm">
              ... and {questions.length - 5} more questions
            </Text>
          )}
        </View>
      </View>

      {/* Quiz Attempts */}
      <View className="mb-6">
        <Text className="text-white text-xl font-bold mb-2">
          Quiz Attempts ({attempts.length})
        </Text>
        <View className="bg-slate-800 p-3 rounded">
          {attempts.length === 0 ? (
            <Text className="text-gray-400">No attempts found</Text>
          ) : (
            attempts.map(attempt => (
              <View key={attempt.id} className="mb-2 p-2 bg-slate-700 rounded">
                <Text className="text-white font-semibold">
                  Quiz {attempt.quizId} - Score: {attempt.score}%
                </Text>
                <Text className="text-gray-400 text-sm">
                  User: {attempt.userId} | Time: {attempt.timeTaken}s
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* User Progress */}
      <View className="mb-6">
        <Text className="text-white text-xl font-bold mb-2">
          User Progress ({progress.length})
        </Text>
        <View className="bg-slate-800 p-3 rounded">
          {progress.length === 0 ? (
            <Text className="text-gray-400">No progress found</Text>
          ) : (
            progress.map(prog => (
              <View key={prog.id} className="mb-2 p-2 bg-slate-700 rounded">
                <Text className="text-white font-semibold">
                  {prog.userId} - {prog.subject}
                </Text>
                <Text className="text-gray-400 text-sm">
                  Completed: {prog.completedQuizzes}/{prog.totalQuizzes} | Avg
                  Score: {prog.averageScore}%
                </Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
