// screens/HomeScreen.js
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type Subject = {
  id: number;
  name: string;
  progress: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: [string, string];
};

type Activity = {
  id: number;
  subject: string;
  lesson: string;
  time: string;
  points: number;
};

const HomeScreen: React.FC = () => {
  const subjects: Subject[] = [
    {
      id: 1,
      name: "Mathematics",
      progress: 75,
      icon: "calculator",
      color: ["#667eea", "#764ba2"],
    },
    {
      id: 2,
      name: "Physics",
      progress: 60,
      icon: "planet",
      color: ["#f093fb", "#f5576c"],
    },
    {
      id: 3,
      name: "Chemistry",
      progress: 45,
      icon: "flask",
      color: ["#4facfe", "#00f2fe"],
    },
    {
      id: 4,
      name: "Biology",
      progress: 80,
      icon: "leaf",
      color: ["#43e97b", "#38f9d7"],
    },
  ];

  const recentActivity: Activity[] = [
    {
      id: 1,
      subject: "Mathematics",
      lesson: "Calculus Basics",
      time: "2 hours ago",
      points: 25,
    },
    {
      id: 2,
      subject: "Physics",
      lesson: "Wave Motion",
      time: "1 day ago",
      points: 30,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-slate-900">
      {/* Header */}
      <LinearGradient
        colors={["#0f0f23", "#1a1a2e"]}
        className="px-6 pt-14 pb-8"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">Welcome back!</Text>
            <Text className="text-gray-400 text-base">
              Ready to learn today?
            </Text>
          </View>
          <TouchableOpacity className="bg-slate-800 p-3 rounded-full">
            <Ionicons name="notifications-outline" size={24} color="#00d4ff" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View className="flex-row justify-between">
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            className="flex-1 p-4 rounded-2xl mr-2"
          >
            <Text className="text-white text-sm opacity-80">Study Streak</Text>
            <Text className="text-white text-2xl font-bold">12 Days</Text>
          </LinearGradient>
          <LinearGradient
            colors={["#f093fb", "#f5576c"]}
            className="flex-1 p-4 rounded-2xl ml-2"
          >
            <Text className="text-white text-sm opacity-80">Total Points</Text>
            <Text className="text-white text-2xl font-bold">2,847</Text>
          </LinearGradient>
        </View>
      </LinearGradient>

      {/* Continue Learning */}
      <View className="px-6 mt-6">
        <Text className="text-white text-xl font-bold mb-4">
          Continue Learning
        </Text>
        <TouchableOpacity className="bg-slate-800 rounded-3xl overflow-hidden">
          <LinearGradient
            colors={["#4facfe", "#00f2fe"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6"
          >
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">
                  Mathematics
                </Text>
                <Text className="text-white opacity-80">
                  Differential Equations
                </Text>
                <View className="bg-white bg-opacity-20 rounded-full h-2 mt-3">
                  <View className="bg-white rounded-full h-2 w-3/4" />
                </View>
              </View>
              <Ionicons name="play-circle" size={48} color="white" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Subject Progress */}
      <View className="px-6 mt-8">
        <Text className="text-white text-xl font-bold mb-4">Your Subjects</Text>
        <View className="flex-row flex-wrap justify-between">
          {subjects.map(subject => (
            <TouchableOpacity key={subject.id} className="w-[48%] mb-4">
              <LinearGradient
                colors={subject.color}
                className="p-5 rounded-2xl"
              >
                <Ionicons
                  name={subject.icon}
                  size={32}
                  color="white"
                  className="mb-3"
                />
                <Text className="text-white font-bold text-base">
                  {subject.name}
                </Text>
                <Text className="text-white opacity-70 text-sm">
                  {subject.progress}% Complete
                </Text>
                <View className="bg-white bg-opacity-30 rounded-full h-1.5 mt-2">
                  <View
                    className="bg-white rounded-full h-1.5"
                    style={{ width: `${subject.progress}%` }}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View className="px-6 mt-8 mb-8">
        <Text className="text-white text-xl font-bold mb-4">
          Recent Activity
        </Text>
        {recentActivity.map(activity => (
          <View key={activity.id} className="bg-slate-800 p-4 rounded-2xl mb-3">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-white font-semibold">
                  {activity.lesson}
                </Text>
                <Text className="text-gray-400 text-sm">
                  {activity.subject}
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {activity.time}
                </Text>
              </View>
              <View className="bg-yellow-500 px-3 py-1 rounded-full">
                <Text className="text-black font-bold text-sm">
                  +{activity.points}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
