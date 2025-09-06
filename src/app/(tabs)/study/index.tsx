import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import {
  Subject,
  SubscriptionService,
} from "../../../superbase/services/subscriptionService";

// Define types for better type safety
type LocalSubject = {
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
  const { user } = useAuth();

  const [subscribedSubjects, setSubscribedSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load user's subscribed subjects
  const loadSubscribedSubjects = async () => {
    if (!user?.id) return;

    try {
      const subjects = await SubscriptionService.getUserSubscriptions(user.id);
      setSubscribedSubjects(subjects);
    } catch (error) {
      console.error("Error loading subscribed subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await loadSubscribedSubjects();
    setRefreshing(false);
  };

  // Load subjects on component mount
  useEffect(() => {
    loadSubscribedSubjects();
  }, [user?.id]);

  // Handle subscribing to new subjects
  const handleSubscribeToSubjects = () => {
    router.push("/study/subscribe");
  };

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
    <ScrollView
      className="flex-1 bg-slate-900"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={["#0f0f23", "#1a1a2e"]}
        className="px-6 pt-14 pb-8"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">Study Hub</Text>
            <Text className="text-gray-400 text-base">
              Your subscribed subjects
            </Text>
          </View>
          <TouchableOpacity className="bg-slate-800 p-3 rounded-full">
            <Ionicons name="search" size={24} color="#00d4ff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Subjects */}
      <View className="px-6 mt-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-xl font-bold">Your Subjects</Text>
          <TouchableOpacity
            onPress={handleSubscribeToSubjects}
            className="bg-blue-600 px-4 py-2 rounded-full"
          >
            <Text className="text-white text-sm font-medium">
              + Add Subject
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="items-center py-8">
            <Text className="text-gray-400">Loading your subjects...</Text>
          </View>
        ) : subscribedSubjects.length === 0 ? (
          <View className="items-center py-8">
            <Ionicons name="book-outline" size={64} color="#6b7280" />
            <Text className="text-white text-lg font-semibold mt-4">
              No Subjects Yet
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              Subscribe to subjects to start learning
            </Text>
            <TouchableOpacity
              onPress={handleSubscribeToSubjects}
              className="bg-blue-600 px-6 py-3 rounded-full mt-4"
            >
              <Text className="text-white font-medium">Browse Subjects</Text>
            </TouchableOpacity>
          </View>
        ) : (
          subscribedSubjects.map(subject => (
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
                    <Ionicons
                      name={subject.icon as any}
                      size={28}
                      color="white"
                    />
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
                        {subject.user_progress?.completed_chapters || 0}/
                        {subject.chapters} chapters completed
                      </Text>
                      <View className="flex-row items-center">
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text className="text-yellow-400 text-sm ml-1">
                          {subject.user_progress?.total_xp || 0} XP
                        </Text>
                      </View>
                    </View>

                    <View className="bg-slate-700 rounded-full h-2">
                      <LinearGradient
                        colors={subject.color}
                        className="rounded-full h-2"
                        style={{
                          width: `${((subject.user_progress?.completed_chapters || 0) / subject.chapters) * 100}%`,
                        }}
                      />
                    </View>

                    {subject.user_progress?.streak &&
                      subject.user_progress.streak > 0 && (
                        <View className="flex-row items-center mt-2">
                          <Ionicons name="flame" size={16} color="#FF6B6B" />
                          <Text className="text-red-400 text-xs ml-1">
                            {subject.user_progress.streak} day streak
                          </Text>
                        </View>
                      )}
                  </View>

                  <Ionicons name="chevron-forward" size={24} color="#6b7280" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
