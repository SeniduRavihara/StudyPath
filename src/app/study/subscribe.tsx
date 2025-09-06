import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import {
  Subject,
  SubscriptionService,
} from "../../superbase/services/subscriptionService";

export default function SubscribeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [subscribing, setSubscribing] = useState<string | null>(null);

  // Load available subjects
  const loadAvailableSubjects = async () => {
    if (!user?.id) return;

    try {
      const subjects = await SubscriptionService.getAvailableSubjects(user.id);
      setAvailableSubjects(subjects);
    } catch (error) {
      console.error("Error loading available subjects:", error);
      Alert.alert("Error", "Failed to load subjects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAvailableSubjects();
    setRefreshing(false);
  };

  // Subscribe to a subject
  const handleSubscribe = async (subjectId: string, subjectName: string) => {
    if (!user?.id) return;

    setSubscribing(subjectId);

    try {
      const success = await SubscriptionService.subscribeToSubject(
        user.id,
        subjectId,
      );

      if (success) {
        Alert.alert(
          "Success!",
          `You've subscribed to ${subjectName}. You can now start learning!`,
          [
            {
              text: "OK",
              onPress: () => {
                // Remove the subscribed subject from available list
                setAvailableSubjects(prev =>
                  prev.filter(subject => subject.id !== subjectId),
                );
              },
            },
          ],
        );
      } else {
        Alert.alert("Error", "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Error subscribing to subject:", error);
      Alert.alert("Error", "Failed to subscribe. Please try again.");
    } finally {
      setSubscribing(null);
    }
  };

  // Load subjects on component mount
  useEffect(() => {
    loadAvailableSubjects();
  }, [user?.id]);

  // Filter subjects based on search term
  const filteredSubjects = availableSubjects.filter(
    subject =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
            <Text className="text-white text-2xl font-bold">
              Browse Subjects
            </Text>
            <Text className="text-gray-400 text-base">
              Subscribe to new subjects
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-slate-800 p-3 rounded-full"
          >
            <Ionicons name="close" size={24} color="#00d4ff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-slate-800 rounded-2xl px-4 py-3 flex-row items-center">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            className="flex-1 text-white ml-3"
            placeholder="Search subjects..."
            placeholderTextColor="#6b7280"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </LinearGradient>

      {/* Subjects List */}
      <View className="px-6 mt-6">
        {loading ? (
          <View className="items-center py-8">
            <Text className="text-gray-400">Loading subjects...</Text>
          </View>
        ) : filteredSubjects.length === 0 ? (
          <View className="items-center py-8">
            <Ionicons name="book-outline" size={64} color="#6b7280" />
            <Text className="text-white text-lg font-semibold mt-4">
              {searchTerm ? "No Results Found" : "All Caught Up!"}
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              {searchTerm
                ? "Try searching for a different subject"
                : "You've subscribed to all available subjects"}
            </Text>
          </View>
        ) : (
          filteredSubjects.map(subject => (
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

                    {subject.description && (
                      <Text className="text-gray-400 text-sm mb-3">
                        {subject.description}
                      </Text>
                    )}

                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-400 text-sm">
                        {subject.chapters} chapters available
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          handleSubscribe(subject.id, subject.name)
                        }
                        disabled={subscribing === subject.id}
                        className={`px-4 py-2 rounded-full ${
                          subscribing === subject.id
                            ? "bg-gray-600"
                            : "bg-blue-600"
                        }`}
                      >
                        <Text className="text-white text-sm font-medium">
                          {subscribing === subject.id
                            ? "Subscribing..."
                            : "Subscribe"}
                        </Text>
                      </TouchableOpacity>
                    </View>
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
