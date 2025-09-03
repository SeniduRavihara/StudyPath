import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Define types for better type safety
type Subject = {
  id: number;
  name: string;
  chapters: number;
  completed: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: [string, string];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  xp: number;
  streak: number;
};

export default function StudyScreen() {
  const router = useRouter();
  const { subject } = useLocalSearchParams();
  const parsedSubject = subject ? JSON.parse(subject as string) : null;

  const subjects: Subject[] = [
    {
      id: 1,
      name: "Mathematics",
      chapters: 12,
      completed: 9,
      icon: "calculator",
      color: ["#667eea", "#764ba2"],
      difficulty: "Advanced",
      xp: 1250,
      streak: 5,
    },
    {
      id: 2,
      name: "Physics",
      chapters: 15,
      completed: 9,
      icon: "planet",
      color: ["#f093fb", "#f5576c"],
      difficulty: "Intermediate",
      xp: 980,
      streak: 3,
    },
    {
      id: 3,
      name: "Chemistry",
      chapters: 14,
      completed: 6,
      icon: "flask",
      color: ["#4facfe", "#00f2fe"],
      difficulty: "Advanced",
      xp: 750,
      streak: 2,
    },
    {
      id: 4,
      name: "Biology",
      chapters: 16,
      completed: 13,
      icon: "leaf",
      color: ["#43e97b", "#38f9d7"],
      difficulty: "Beginner",
      xp: 1500,
      streak: 7,
    },
  ];

  // If we have a subject from navigation, redirect to topics screen
  React.useEffect(() => {
    if (parsedSubject) {
      router.replace({
        pathname: "/study/topics",
        params: { subject: JSON.stringify(parsedSubject) },
      });
    }
  }, [parsedSubject, router]);

  return (
    <ScrollView className="flex-1 bg-slate-900">
      {/* Header */}
      <LinearGradient
        colors={["#0f0f23", "#1a1a2e"]}
        className="px-6 pt-14 pb-8"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">Study Hub</Text>
            <Text className="text-gray-400 text-base">Choose your subject</Text>
          </View>
          <TouchableOpacity className="bg-slate-800 p-3 rounded-full">
            <Ionicons name="search" size={24} color="#00d4ff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View className="px-6 mt-6">
        <LinearGradient
          colors={["#1a1a2e", "#16213e"]}
          className="p-6 rounded-3xl"
        >
          <Text className="text-white text-lg font-bold mb-4">
            Your Progress
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-400">47</Text>
              <Text className="text-gray-400 text-sm">Lessons</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-400">37</Text>
              <Text className="text-gray-400 text-sm">Completed</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-yellow-400">2,847</Text>
              <Text className="text-gray-400 text-sm">Points</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Daily Streak */}
      <View className="px-6 mt-6">
        <LinearGradient
          colors={["#1a1a2e", "#16213e"]}
          className="p-6 rounded-3xl"
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-lg font-bold">Daily Streak</Text>
              <Text className="text-gray-400 text-sm">
                Keep learning daily!
              </Text>
            </View>
            <View className="bg-yellow-500/20 px-4 py-2 rounded-full">
              <Text className="text-yellow-400 font-bold">🔥 5 Days</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Subjects */}
      <View className="px-6 mt-8">
        <Text className="text-white text-xl font-bold mb-4">Subjects</Text>
        {subjects.map(subject => (
          <TouchableOpacity
            key={subject.id}
            className="mb-4"
            onPress={() =>
              router.push({
                pathname: "/study/topics",
                params: { subject: JSON.stringify(subject) },
              })
            }
          >
            <LinearGradient
              colors={["#1a1a2e", "#16213e"]}
              className="p-6 rounded-3xl"
            >
              <View className="flex-row items-center">
                <LinearGradient
                  colors={subject.color}
                  className="p-4 rounded-2xl mr-4"
                >
                  <Ionicons name={subject.icon} size={28} color="white" />
                </LinearGradient>

                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white text-lg font-bold">
                      {subject.name}
                    </Text>
                    <View className="bg-slate-700 px-3 py-1 rounded-full">
                      <Text className="text-gray-300 text-xs">
                        {subject.difficulty}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-gray-400 text-sm">
                      {subject.completed}/{subject.chapters} chapters completed
                    </Text>
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text className="text-yellow-400 text-sm ml-1">
                        {subject.xp} XP
                      </Text>
                    </View>
                  </View>

                  <View className="bg-slate-700 rounded-full h-2">
                    <LinearGradient
                      colors={subject.color}
                      className="rounded-full h-2"
                      style={{
                        width: `${(subject.completed / subject.chapters) * 100}%`,
                      }}
                    />
                  </View>

                  {subject.streak > 0 && (
                    <View className="flex-row items-center mt-2">
                      <Ionicons name="flame" size={16} color="#FF6B6B" />
                      <Text className="text-red-400 text-xs ml-1">
                        {subject.streak} day streak
                      </Text>
                    </View>
                  )}
                </View>

                <Ionicons name="chevron-forward" size={24} color="#6b7280" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
