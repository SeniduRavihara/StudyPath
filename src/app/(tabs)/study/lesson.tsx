import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type Lesson = {
  id: number;
  title: string;
  duration: string;
  type: "video" | "reading" | "quiz";
  completed: boolean;
  points: number;
};

export default function LessonScreen() {
  const router = useRouter();
  const { chapter, subject } = useLocalSearchParams();
  const parsedChapter = JSON.parse(chapter as string);
  const parsedSubject = JSON.parse(subject as string);
  const [, setSelectedLesson] = useState<Lesson | null>(null);

  const lessons: Lesson[] = [
    {
      id: 1,
      title: "What is Calculus?",
      duration: "15 min",
      type: "video",
      completed: true,
      points: 25,
    },
    {
      id: 2,
      title: "Historical Background",
      duration: "10 min",
      type: "reading",
      completed: true,
      points: 20,
    },
    {
      id: 3,
      title: "Basic Concepts",
      duration: "20 min",
      type: "video",
      completed: true,
      points: 30,
    },
    {
      id: 4,
      title: "Practice Problems",
      duration: "25 min",
      type: "quiz",
      completed: false,
      points: 50,
    },
    {
      id: 5,
      title: "Real-world Applications",
      duration: "18 min",
      type: "video",
      completed: false,
      points: 35,
    },
  ];

  const getTypeIcon = (
    type: Lesson["type"],
  ): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case "video":
        return "play-circle";
      case "reading":
        return "book";
      case "quiz":
        return "help-circle";
      default:
        return "document";
    }
  };
  const getTypeColor = (type: Lesson["type"]): string => {
    switch (type) {
      case "video":
        return "#ef4444";
      case "reading":
        return "#3b82f6";
      case "quiz":
        return "#f59e0b";
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
            <Text className="text-white opacity-80 text-sm">
              {parsedSubject.name}
            </Text>
            <Text className="text-white text-xl font-bold">
              {parsedChapter.title}
            </Text>
          </View>
        </View>

        {/* Chapter Progress */}
        <View className="bg-white bg-opacity-30 rounded-full h-2 mb-3">
          <View
            className="bg-white rounded-full h-2"
            style={{
              width: `${(parsedChapter.completed / parsedChapter.lessons) * 100}%`,
            }}
          />
        </View>
        <Text className="text-white opacity-80 text-sm">
          {parsedChapter.completed}/{parsedChapter.lessons} lessons completed
        </Text>
      </LinearGradient>

      {/* Lessons List */}
      <View className="px-6 mt-6">
        <Text className="text-white text-xl font-bold mb-4">Lessons</Text>

        {lessons.map((lesson, index) => (
          <TouchableOpacity
            key={lesson.id}
            className={`rounded-3xl p-5 mb-4 ${
              lesson.completed
                ? "bg-slate-800"
                : "bg-slate-800 border-2 border-blue-500"
            }`}
            onPress={() => setSelectedLesson(lesson)}
          >
            <View className="flex-row items-center">
              <View className="mr-4">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: getTypeColor(lesson.type) }}
                >
                  <Ionicons
                    name={getTypeIcon(lesson.type)}
                    size={20}
                    color="white"
                  />
                </View>
              </View>

              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-white font-semibold text-base">
                    {lesson.title}
                  </Text>
                  {lesson.completed && (
                    <View className="bg-green-500 p-1 rounded-full">
                      <Ionicons name="checkmark" size={16} color="white" />
                    </View>
                  )}
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-400 text-sm capitalize">
                    {lesson.type} • {lesson.duration}
                  </Text>
                  <View className="bg-yellow-500 px-2 py-1 rounded-full">
                    <Text className="text-black text-xs font-bold">
                      {lesson.points}pts
                    </Text>
                  </View>
                </View>
              </View>

              <View className="ml-3">
                <Ionicons
                  name={
                    lesson.completed
                      ? "checkmark-circle"
                      : "play-circle-outline"
                  }
                  size={24}
                  color={lesson.completed ? "#10b981" : "#6b7280"}
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <View className="px-6 mt-8 mb-8">
        <LinearGradient
          colors={parsedSubject.color}
          className="rounded-2xl overflow-hidden"
        >
          <TouchableOpacity className="p-4">
            <View className="flex-row items-center justify-center">
              <Ionicons name="play" size={24} color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                Continue Learning
              </Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}
