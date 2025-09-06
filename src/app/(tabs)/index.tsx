// screens/HomeScreen.js
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import {
  Subject,
  SubscriptionService,
} from "../../superbase/services/subscriptionService";

type LocalSubject = {
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
  const router = useRouter();
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
      {subscribedSubjects.length > 0 && (
        <View className="px-6 mt-6">
          <Text className="text-white text-xl font-bold mb-4">
            Continue Learning
          </Text>
          <TouchableOpacity
            className="bg-slate-800 rounded-3xl overflow-hidden"
            onPress={() =>
              router.push({
                pathname: "/study/topics",
                params: { subject: JSON.stringify(subscribedSubjects[0]) },
              })
            }
          >
            <LinearGradient
              colors={subscribedSubjects[0].color}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-6"
            >
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Text className="text-white text-lg font-bold">
                    {subscribedSubjects[0].name}
                  </Text>
                  <Text className="text-white opacity-80">
                    {subscribedSubjects[0].user_progress?.completed_chapters ||
                      0}
                    /{subscribedSubjects[0].chapters} chapters completed
                  </Text>
                  <View className="bg-white bg-opacity-20 rounded-full h-2 mt-3">
                    <View
                      className="bg-white rounded-full h-2"
                      style={{
                        width: `${Math.round(((subscribedSubjects[0].user_progress?.completed_chapters || 0) / subscribedSubjects[0].chapters) * 100)}%`,
                      }}
                    />
                  </View>
                </View>
                <Ionicons name="play-circle" size={48} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Subject Progress */}
      <View className="px-6 mt-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-xl font-bold">Your Subjects</Text>
          <TouchableOpacity
            onPress={() => router.push("/study")}
            className="bg-blue-600 px-3 py-1 rounded-full"
          >
            <Text className="text-white text-sm font-medium">View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="items-center py-4">
            <Text className="text-gray-400">Loading your subjects...</Text>
          </View>
        ) : subscribedSubjects.length === 0 ? (
          <View className="items-center py-8">
            <Ionicons name="book-outline" size={48} color="#6b7280" />
            <Text className="text-white text-lg font-semibold mt-3">
              No Subjects Yet
            </Text>
            <Text className="text-gray-400 text-center mt-1">
              Subscribe to subjects to start learning
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/study")}
              className="bg-blue-600 px-4 py-2 rounded-full mt-3"
            >
              <Text className="text-white font-medium">Browse Subjects</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {subscribedSubjects.slice(0, 4).map(subject => {
              const progress =
                subject.chapters > 0
                  ? Math.round(
                      ((subject.user_progress?.completed_chapters || 0) /
                        subject.chapters) *
                        100,
                    )
                  : 0;

              return (
                <TouchableOpacity
                  key={subject.id}
                  className="w-[48%] mb-4"
                  onPress={() =>
                    router.push({
                      pathname: "/study/topics",
                      params: { subject: JSON.stringify(subject) },
                    })
                  }
                >
                  <LinearGradient
                    colors={subject.color}
                    className="p-5 rounded-2xl"
                  >
                    <Ionicons
                      name={subject.icon as any}
                      size={32}
                      color="white"
                      className="mb-3"
                    />
                    <Text className="text-white font-bold text-base">
                      {subject.name}
                    </Text>
                    <Text className="text-white opacity-70 text-sm">
                      {progress}% Complete
                    </Text>
                    <View className="bg-white bg-opacity-30 rounded-full h-1.5 mt-2">
                      <View
                        className="bg-white rounded-full h-1.5"
                        style={{ width: `${progress}%` }}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
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
