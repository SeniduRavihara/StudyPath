import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  MockSubject,
  MockSubscriptionService,
} from "../../../lib/mockSubscriptionService";

export default function SubscribeScreen() {
  const router = useRouter();
  const [allSubjects, setAllSubjects] = useState<MockSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load all subjects
  const loadAllSubjects = async () => {
    try {
      const subjects = MockSubscriptionService.getAllSubjects();
      setAllSubjects(subjects);
    } catch (error) {
      console.error("Error loading subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllSubjects();
    setRefreshing(false);
  };

  // Load subjects on component mount
  useEffect(() => {
    loadAllSubjects();
  }, []);

  // Handle subscription
  const handleSubscribe = async (subject: MockSubject) => {
    try {
      const result = await MockSubscriptionService.subscribeToSubject(
        subject.id,
      );
      if (result.success) {
        Alert.alert("Success", result.message);
        // Refresh the list
        await loadAllSubjects();
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to subscribe to subject");
    }
  };

  // Handle unsubscription
  const handleUnsubscribe = async (subject: MockSubject) => {
    try {
      const result = await MockSubscriptionService.unsubscribeFromSubject(
        subject.id,
      );
      if (result.success) {
        Alert.alert("Success", result.message);
        // Refresh the list
        await loadAllSubjects();
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to unsubscribe from subject");
    }
  };

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
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-slate-800 p-2 rounded-full mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#00d4ff" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">
              Browse Subjects
            </Text>
            <Text className="text-gray-400 text-base">
              Subscribe to subjects you want to learn
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Subjects */}
      <View className="px-6 mt-8">
        {loading ? (
          <View className="items-center py-8">
            <Text className="text-gray-400">Loading subjects...</Text>
          </View>
        ) : (
          allSubjects.map(subject => (
            <View key={subject.id} className="mb-4">
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

                    <Text className="text-gray-400 text-sm mb-3">
                      {subject.description}
                    </Text>

                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-gray-400 text-sm">
                        {subject.chapters} chapters
                      </Text>
                      <View className="flex-row items-center">
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text className="text-yellow-400 text-sm ml-1">
                          {subject.xp} XP
                        </Text>
                      </View>
                    </View>

                    {subject.streak > 0 && (
                      <View className="flex-row items-center mb-3">
                        <Ionicons name="flame" size={16} color="#FF6B6B" />
                        <Text className="text-red-400 text-xs ml-1">
                          {subject.streak} day streak
                        </Text>
                      </View>
                    )}

                    <TouchableOpacity
                      onPress={() =>
                        subject.isSubscribed
                          ? handleUnsubscribe(subject)
                          : handleSubscribe(subject)
                      }
                      className={`py-3 px-6 rounded-full ${
                        subject.isSubscribed ? "bg-red-600" : "bg-blue-600"
                      }`}
                    >
                      <Text className="text-white font-semibold text-center">
                        {subject.isSubscribed ? "Unsubscribe" : "Subscribe"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </View>
          ))
        )}
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
