/* eslint-disable prettier/prettier */
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

type UserStats = {
  name: string;
  email: string;
  level: string;
  points: number;
  streak: number;
  completedLessons: number;
  totalHours: number;
  rank: string;
};

type Achievement = {
  name: string;
  date: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
};

export default function ProfileScreen() {
  const { user, signOut, loading } = useAuth();

  console.log("Profile Screen - User:", user); // Debug log

  // If no user, redirect to login immediately
  if (!loading && !user) {
    console.log("Profile Screen - NO USER, redirecting to login!"); // Debug log
    return <Redirect href="/auth/login" />;
  }

  // If still loading, show loading state
  if (loading) {
    return (
      <View className="flex-1 bg-slate-900 justify-center items-center">
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );
  }

  const userStats: UserStats = {
    name: user?.user_metadata?.name || "Student",
    email: user?.email || "student@email.com",
    level: "Advanced Learner",
    points: 2847,
    streak: 12,
    completedLessons: 47,
    totalHours: 156,
    rank: "Top 5%",
  };

  const recentAchievements: Achievement[] = [
    { name: "Mathematics Master", date: "2 days ago", icon: "calculator" },
    { name: "Study Streak Champion", date: "1 week ago", icon: "flame" },
    { name: "Perfect Score", date: "2 weeks ago", icon: "trophy" },
  ];

  const menuItems: MenuItem[] = [
    {
      icon: "person-outline",
      title: "Edit Profile",
      subtitle: "Update your information",
    },
    {
      icon: "settings-outline",
      title: "Settings",
      subtitle: "Preferences and notifications",
    },
    {
      icon: "help-circle-outline",
      title: "Help & Support",
      subtitle: "Get help and contact us",
    },
    {
      icon: "information-circle-outline",
      title: "About",
      subtitle: "App version and info",
    },
  ];

  const handleLogout = async () => {
    console.log("Logout button pressed"); // Debug log

    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            console.log("Attempting to sign out..."); // Debug log
            const { error } = await signOut();
            if (error) {
              console.error("Sign out error:", error); // Debug log
              Alert.alert("Error", `Failed to logout: ${error.message}`);
            } else {
              console.log("Sign out successful"); // Debug log
            }
          } catch (error) {
            console.error("Sign out exception:", error); // Debug log
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-slate-900">
      {/* Profile Header */}
      <LinearGradient
        colors={["#0f0f23", "#1a1a2e"]}
        className="px-6 pt-14 pb-8"
      >
        <View className="items-center">
          <View className="relative">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
              }}
              className="w-24 h-24 rounded-full"
            />
            <TouchableOpacity className="absolute -bottom-2 -right-2 bg-blue-500 p-2 rounded-full">
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-white text-2xl font-bold mt-4">
            {userStats.name}
          </Text>
          <Text className="text-gray-400 text-base">{userStats.email}</Text>
          <View className="bg-blue-500 px-4 py-2 rounded-full mt-3">
            <Text className="text-white font-semibold">{userStats.level}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Grid */}
      <View className="px-6 mt-6">
        <View className="flex-row flex-wrap justify-between">
          <View className="w-[48%] bg-slate-800 p-4 rounded-2xl mb-4">
            <Ionicons name="trophy" size={24} color="#f59e0b" />
            <Text className="text-white text-2xl font-bold mt-2">
              {userStats.points.toLocaleString()}
            </Text>
            <Text className="text-gray-400 text-sm">Total Points</Text>
          </View>

          <View className="w-[48%] bg-slate-800 p-4 rounded-2xl mb-4">
            <Ionicons name="flame" size={24} color="#ef4444" />
            <Text className="text-white text-2xl font-bold mt-2">
              {userStats.streak}
            </Text>
            <Text className="text-gray-400 text-sm">Day Streak</Text>
          </View>

          <View className="w-[48%] bg-slate-800 p-4 rounded-2xl mb-4">
            <Ionicons name="book" size={24} color="#10b981" />
            <Text className="text-white text-2xl font-bold mt-2">
              {userStats.completedLessons}
            </Text>
            <Text className="text-gray-400 text-sm">Lessons Done</Text>
          </View>

          <View className="w-[48%] bg-slate-800 p-4 rounded-2xl mb-4">
            <Ionicons name="time" size={24} color="#8b5cf6" />
            <Text className="text-white text-2xl font-bold mt-2">
              {userStats.totalHours}h
            </Text>
            <Text className="text-gray-400 text-sm">Study Time</Text>
          </View>
        </View>
      </View>

      {/* Recent Achievements */}
      <View className="px-6 mt-8">
        <Text className="text-white text-xl font-bold mb-4">
          Recent Achievements
        </Text>
        {recentAchievements.map((achievement, index) => (
          <View key={index} className="bg-slate-800 p-4 rounded-2xl mb-3">
            <View className="flex-row items-center">
              <View className="bg-yellow-500 p-3 rounded-full mr-4">
                <Ionicons name={achievement.icon} size={20} color="black" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">
                  {achievement.name}
                </Text>
                <Text className="text-gray-400 text-sm">
                  {achievement.date}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Menu Items */}
      <View className="px-6 mt-8">
        <Text className="text-white text-xl font-bold mb-4">Settings</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="bg-slate-800 p-4 rounded-2xl mb-3"
          >
            <View className="flex-row items-center">
              <Ionicons
                name={item.icon}
                size={24}
                color="#6b7280"
                className="mr-4"
              />
              <View className="flex-1">
                <Text className="text-white font-semibold">{item.title}</Text>
                <Text className="text-gray-400 text-sm">{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <View className="px-6 mt-8 mb-8">
        <TouchableOpacity
          className="bg-red-600 p-4 rounded-2xl"
          onPress={handleLogout}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
