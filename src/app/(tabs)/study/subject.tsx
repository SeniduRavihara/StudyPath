import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type Chapter = {
  id: number;
  title: string;
  lessons: number;
  completed: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  points: number;
};

export default function SubjectDetailScreen() {
  const router = useRouter();
  const { subject } = useLocalSearchParams();
  const parsedSubject = JSON.parse(subject as string);

  const chapters: Chapter[] = [
    {
      id: 1,
      title: "Introduction to Calculus",
      lessons: 8,
      completed: 8,
      difficulty: "Beginner",
      duration: "2 hours",
      points: 200,
    },
    {
      id: 2,
      title: "Limits and Continuity",
      lessons: 12,
      completed: 12,
      difficulty: "Beginner",
      duration: "3 hours",
      points: 300,
    },
    {
      id: 3,
      title: "Derivatives",
      lessons: 15,
      completed: 10,
      difficulty: "Intermediate",
      duration: "4 hours",
      points: 400,
    },
    {
      id: 4,
      title: "Applications of Derivatives",
      lessons: 18,
      completed: 5,
      difficulty: "Intermediate",
      duration: "5 hours",
      points: 500,
    },
    {
      id: 5,
      title: "Integration",
      lessons: 20,
      completed: 0,
      difficulty: "Advanced",
      duration: "6 hours",
      points: 600,
    },
  ];

  const getDifficultyColor = (difficulty: Chapter["difficulty"]): string => {
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
              {parsedSubject.name}
            </Text>
            <Text className="text-white opacity-80">
              {parsedSubject.completed}/{parsedSubject.chapters} chapters
              completed
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="bg-white bg-opacity-30 rounded-full h-3 mb-4">
          <View
            className="bg-white rounded-full h-3"
            style={{
              width: `${(parsedSubject.completed / parsedSubject.chapters) * 100}%`,
            }}
          />
        </View>

        {/* Stats */}
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">
              {parsedSubject.chapters}
            </Text>
            <Text className="text-white opacity-80 text-sm">Chapters</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">156</Text>
            <Text className="text-white opacity-80 text-sm">Lessons</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">3.2k</Text>
            <Text className="text-white opacity-80 text-sm">Points</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Chapters List */}
      <View className="px-6 mt-6">
        <Text className="text-white text-xl font-bold mb-4">Chapters</Text>

        {chapters.map((chapter, index) => (
          <TouchableOpacity
            key={chapter.id}
            className="bg-slate-800 rounded-3xl p-5 mb-4"
            onPress={() =>
              router.push({
                pathname: "/study/lesson",
                params: {
                  chapter: JSON.stringify(chapter),
                  subject: JSON.stringify(parsedSubject),
                },
              })
            }
          >
            <View className="flex-row items-start">
              <View className="mr-4">
                <LinearGradient
                  colors={
                    chapter.completed === chapter.lessons
                      ? ["#10b981", "#059669"]
                      : ["#374151", "#4b5563"]
                  }
                  className="w-8 h-8 rounded-full items-center justify-center"
                >
                  {chapter.completed === chapter.lessons ? (
                    <Ionicons name="checkmark" size={20} color="white" />
                  ) : (
                    <Text className="text-white font-bold">{index + 1}</Text>
                  )}
                </LinearGradient>
              </View>

              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-white font-bold text-lg">
                    {chapter.title}
                  </Text>
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: getDifficultyColor(chapter.difficulty),
                    }}
                  >
                    <Text className="text-white text-xs font-semibold">
                      {chapter.difficulty}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-gray-400 text-sm">
                    {chapter.completed}/{chapter.lessons} lessons •{" "}
                    {chapter.duration}
                  </Text>
                  <View className="bg-yellow-500 px-2 py-1 rounded-full">
                    <Text className="text-black text-xs font-bold">
                      {chapter.points}pts
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View className="bg-slate-700 rounded-full h-2">
                  <LinearGradient
                    colors={parsedSubject.color}
                    className="rounded-full h-2"
                    style={{
                      width: `${(chapter.completed / chapter.lessons) * 100}%`,
                    }}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
