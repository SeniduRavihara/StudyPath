import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type Topic = {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: [string, string];
  type: "lessons" | "quizzes";
  count: number;
  completed: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
};

export default function TopicsScreen() {
  const router = useRouter();
  const { subject } = useLocalSearchParams();
  const parsedSubject = JSON.parse(subject as string);

  const topics: Topic[] = [
    {
      id: 1,
      title: "Learning Path",
      description: "Follow the interactive flow-based learning journey",
      icon: "git-branch",
      color: ["#8b5cf6", "#7c3aed"],
      type: "lessons",
      count: 1,
      completed: 0,
      difficulty: "Beginner",
    },
    {
      id: 2,
      title: "Study Lessons",
      description: "Learn through interactive lessons and examples",
      icon: "book",
      color: ["#667eea", "#764ba2"],
      type: "lessons",
      count: 156,
      completed: 89,
      difficulty: "Beginner",
    },
    {
      id: 3,
      title: "Practice Quizzes",
      description: "Test your knowledge with MCQs and exercises",
      icon: "help-circle",
      color: ["#f093fb", "#f5576c"],
      type: "quizzes",
      count: 45,
      completed: 23,
      difficulty: "Intermediate",
    },
  ];

  const handleTopicPress = (topic: Topic) => {
    if (topic.id === 1) {
      // Navigate to flow-based learning path
      router.push({
        pathname: "/study/flow",
        params: { subject: JSON.stringify(parsedSubject) },
      });
    } else if (topic.type === "lessons") {
      // Navigate to chapters/lessons
      router.push({
        pathname: "/study/subject",
        params: { subject: JSON.stringify(parsedSubject) },
      });
    } else if (topic.type === "quizzes") {
      // Navigate to quiz selection
      router.push({
        pathname: "/study/quizzes",
        params: {
          subject: JSON.stringify(parsedSubject),
          topic: JSON.stringify(topic),
        },
      });
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
              Choose your learning path
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="bg-white bg-opacity-30 rounded-full h-3 mb-4">
          <View
            className="bg-white rounded-full h-3"
            style={{
              width: `${((parsedSubject.completed || 0) / (parsedSubject.chapters || 1)) * 100}%`,
            }}
          />
        </View>

        {/* Stats */}
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">
              {parsedSubject.chapters || 0}
            </Text>
            <Text className="text-white opacity-80 text-sm">Chapters</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">
              {parsedSubject.completed || 0}
            </Text>
            <Text className="text-white opacity-80 text-sm">Completed</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">
              {parsedSubject.xp || 0}
            </Text>
            <Text className="text-white opacity-80 text-sm">XP</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Topics Selection */}
      <View className="px-6 mt-8">
        <Text className="text-white text-xl font-bold mb-6 text-center">
          How would you like to learn?
        </Text>

        {topics.map(topic => (
          <TouchableOpacity
            key={topic.id}
            className="mb-6"
            onPress={() => handleTopicPress(topic)}
          >
            <LinearGradient colors={topic.color} className="p-6 rounded-3xl">
              <View className="flex-row items-center">
                <View className="bg-white bg-opacity-20 p-4 rounded-2xl mr-4">
                  <Ionicons name={topic.icon} size={32} color="white" />
                </View>

                <View className="flex-1">
                  <Text className="text-white text-xl font-bold mb-2">
                    {topic.title}
                  </Text>
                  <Text className="text-white opacity-90 text-sm mb-3">
                    {topic.description}
                  </Text>

                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-white opacity-80 text-sm">
                      {topic.completed}/{topic.count} completed
                    </Text>
                    <View className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      <Text className="text-white text-xs font-semibold">
                        {topic.difficulty}
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="bg-white bg-opacity-30 rounded-full h-2">
                    <View
                      className="bg-white rounded-full h-2"
                      style={{
                        width: `${(topic.completed / topic.count) * 100}%`,
                      }}
                    />
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={24} color="white" />
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
            Learning Summary
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-400">
                {topics[0].completed}
              </Text>
              <Text className="text-gray-400 text-sm">Lessons</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-400">
                {topics[1].completed}
              </Text>
              <Text className="text-gray-400 text-sm">Quizzes</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-yellow-400">
                {parsedSubject.xp || 0}
              </Text>
              <Text className="text-gray-400 text-sm">XP</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
