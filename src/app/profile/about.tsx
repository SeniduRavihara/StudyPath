import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AboutScreen() {
  const handleCheckUpdates = () => {
    Alert.alert(
      "Check Updates",
      "You're using the latest version of StudyPath!",
    );
  };

  const handleOpenWebsite = () => {
    Linking.openURL("https://studypath.app");
  };

  const handleOpenGitHub = () => {
    Linking.openURL("https://github.com/studypath/app");
  };

  const handleOpenTwitter = () => {
    Linking.openURL("https://twitter.com/studypath");
  };

  return (
    <ScrollView className="flex-1 bg-slate-900">
      {/* Header */}
      <LinearGradient
        colors={["#0f0f23", "#1a1a2e"]}
        className="px-6 pt-14 pb-6"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">About</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      {/* App Info */}
      <View className="px-6 mt-8">
        <View className="items-center mb-8">
          <View className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-3xl mb-4">
            <Ionicons name="book" size={48} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold mb-2">StudyPath</Text>
          <Text className="text-gray-400 text-base">Version 1.0.0</Text>
          <Text className="text-gray-500 text-sm mt-2">Build 2024.01.15</Text>
        </View>

        <View className="bg-slate-800 p-6 rounded-2xl mb-6">
          <Text className="text-white text-base leading-6 text-center">
            StudyPath is a modern learning platform that helps students track
            their progress, import educational content, and achieve their
            academic goals through interactive quizzes and personalized study
            plans.
          </Text>
        </View>
      </View>

      {/* App Details */}
      <View className="px-6">
        <Text className="text-white text-lg font-bold mb-4">
          App Information
        </Text>

        <View className="bg-slate-800 p-4 rounded-2xl mb-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400">Version</Text>
            <Text className="text-white font-semibold">1.0.0</Text>
          </View>
        </View>

        <View className="bg-slate-800 p-4 rounded-2xl mb-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400">Build</Text>
            <Text className="text-white font-semibold">2024.01.15</Text>
          </View>
        </View>

        <View className="bg-slate-800 p-4 rounded-2xl mb-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400">Platform</Text>
            <Text className="text-white font-semibold">React Native</Text>
          </View>
        </View>

        <View className="bg-slate-800 p-4 rounded-2xl mb-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400">Database</Text>
            <Text className="text-white font-semibold">SQLite + Supabase</Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-slate-800 p-4 rounded-2xl mb-3"
          onPress={handleCheckUpdates}
        >
          <View className="flex-row items-center">
            <Ionicons name="refresh-outline" size={24} color="#3b82f6" />
            <View className="ml-4">
              <Text className="text-white font-semibold">
                Check for Updates
              </Text>
              <Text className="text-gray-400 text-sm">
                See if a new version is available
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Social Links */}
      <View className="px-6 mt-8">
        <Text className="text-white text-lg font-bold mb-4">
          Connect With Us
        </Text>

        <TouchableOpacity
          className="bg-slate-800 p-4 rounded-2xl mb-3"
          onPress={handleOpenWebsite}
        >
          <View className="flex-row items-center">
            <Ionicons name="globe-outline" size={24} color="#3b82f6" />
            <View className="ml-4">
              <Text className="text-white font-semibold">Website</Text>
              <Text className="text-gray-400 text-sm">studypath.app</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-slate-800 p-4 rounded-2xl mb-3"
          onPress={handleOpenGitHub}
        >
          <View className="flex-row items-center">
            <Ionicons name="logo-github" size={24} color="#6b7280" />
            <View className="ml-4">
              <Text className="text-white font-semibold">GitHub</Text>
              <Text className="text-gray-400 text-sm">View source code</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-slate-800 p-4 rounded-2xl mb-3"
          onPress={handleOpenTwitter}
        >
          <View className="flex-row items-center">
            <Ionicons name="logo-twitter" size={24} color="#1da1f2" />
            <View className="ml-4">
              <Text className="text-white font-semibold">Twitter</Text>
              <Text className="text-gray-400 text-sm">
                Follow us for updates
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Credits */}
      <View className="px-6 mt-8 mb-8">
        <Text className="text-white text-lg font-bold mb-4">Credits</Text>

        <View className="bg-slate-800 p-6 rounded-2xl">
          <Text className="text-white font-semibold mb-2">Developed by</Text>
          <Text className="text-gray-400 mb-4">StudyPath Team</Text>

          <Text className="text-white font-semibold mb-2">
            Technologies Used
          </Text>
          <Text className="text-gray-400 mb-2">• React Native & Expo</Text>
          <Text className="text-gray-400 mb-2">• TypeScript</Text>
          <Text className="text-gray-400 mb-2">• Supabase</Text>
          <Text className="text-gray-400 mb-2">• SQLite & Drizzle ORM</Text>
          <Text className="text-gray-400 mb-2">
            • NativeWind (Tailwind CSS)
          </Text>

          <Text className="text-white font-semibold mb-2 mt-4">Icons</Text>
          <Text className="text-gray-400">Ionicons by Ionic Framework</Text>
        </View>
      </View>
    </ScrollView>
  );
}
