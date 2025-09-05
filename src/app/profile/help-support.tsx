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

export default function HelpSupportScreen() {
  const faqItems = [
    {
      question: "How do I import quiz packs?",
      answer:
        "Go to the Feed tab, find quiz pack posts, and tap 'Import Quiz Pack' to add them to your local quizzes.",
    },
    {
      question: "How do I track my progress?",
      answer:
        "Your progress is automatically tracked in the Study tab. Check your statistics in the Profile tab.",
    },
    {
      question: "Can I use the app offline?",
      answer:
        "Yes! Once you import quiz packs, you can take quizzes offline. Your progress syncs when you're back online.",
    },
    {
      question: "How do I reset my progress?",
      answer:
        "Go to the Debug tab and use the 'Clear Database' button to reset all your local data.",
    },
  ];

  const handleContactSupport = () => {
    Alert.alert("Contact Support", "Choose how you'd like to contact us:", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Email",
        onPress: () => Linking.openURL("mailto:support@studypath.app"),
      },
      {
        text: "Live Chat",
        onPress: () =>
          Alert.alert("Live Chat", "Live chat feature coming soon!"),
      },
    ]);
  };

  const handleRateApp = () => {
    Alert.alert(
      "Rate App",
      "Thank you for using StudyPath! Please rate us on the App Store.",
    );
  };

  const handleShareApp = () => {
    Alert.alert(
      "Share App",
      "Share StudyPath with your friends and help them learn!",
    );
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
          <Text className="text-white text-xl font-bold">Help & Support</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View className="px-6 mt-8">
        <Text className="text-white text-lg font-bold mb-4">Quick Actions</Text>

        <TouchableOpacity
          className="bg-slate-800 p-4 rounded-2xl mb-3"
          onPress={handleContactSupport}
        >
          <View className="flex-row items-center">
            <Ionicons name="chatbubble-outline" size={24} color="#3b82f6" />
            <View className="ml-4">
              <Text className="text-white font-semibold">Contact Support</Text>
              <Text className="text-gray-400 text-sm">
                Get help from our team
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-slate-800 p-4 rounded-2xl mb-3"
          onPress={handleRateApp}
        >
          <View className="flex-row items-center">
            <Ionicons name="star-outline" size={24} color="#f59e0b" />
            <View className="ml-4">
              <Text className="text-white font-semibold">Rate App</Text>
              <Text className="text-gray-400 text-sm">Share your feedback</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-slate-800 p-4 rounded-2xl mb-3"
          onPress={handleShareApp}
        >
          <View className="flex-row items-center">
            <Ionicons name="share-outline" size={24} color="#10b981" />
            <View className="ml-4">
              <Text className="text-white font-semibold">Share App</Text>
              <Text className="text-gray-400 text-sm">
                Tell your friends about us
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </View>
        </TouchableOpacity>
      </View>

      {/* FAQ Section */}
      <View className="px-6 mt-8">
        <Text className="text-white text-lg font-bold mb-4">
          Frequently Asked Questions
        </Text>

        {faqItems.map((item, index) => (
          <View key={index} className="bg-slate-800 p-4 rounded-2xl mb-3">
            <Text className="text-white font-semibold mb-2">
              {item.question}
            </Text>
            <Text className="text-gray-400 text-sm leading-5">
              {item.answer}
            </Text>
          </View>
        ))}
      </View>

      {/* Resources Section */}
      <View className="px-6 mt-8 mb-8">
        <Text className="text-white text-lg font-bold mb-4">Resources</Text>

        <TouchableOpacity
          className="bg-slate-800 p-4 rounded-2xl mb-3"
          onPress={() => Linking.openURL("https://studypath.app/privacy")}
        >
          <View className="flex-row items-center">
            <Ionicons name="shield-outline" size={24} color="#6b7280" />
            <View className="ml-4">
              <Text className="text-white font-semibold">Privacy Policy</Text>
              <Text className="text-gray-400 text-sm">
                How we protect your data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-slate-800 p-4 rounded-2xl mb-3"
          onPress={() => Linking.openURL("https://studypath.app/terms")}
        >
          <View className="flex-row items-center">
            <Ionicons name="document-text-outline" size={24} color="#6b7280" />
            <View className="ml-4">
              <Text className="text-white font-semibold">Terms of Service</Text>
              <Text className="text-gray-400 text-sm">
                Our terms and conditions
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-slate-800 p-4 rounded-2xl mb-3"
          onPress={() => Linking.openURL("https://studypath.app/tutorials")}
        >
          <View className="flex-row items-center">
            <Ionicons name="play-circle-outline" size={24} color="#6b7280" />
            <View className="ml-4">
              <Text className="text-white font-semibold">Video Tutorials</Text>
              <Text className="text-gray-400 text-sm">
                Learn how to use the app
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
