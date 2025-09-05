import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [dataSync, setDataSync] = useState(true);

  const handleClearCache = () => {
    Alert.alert("Clear Cache", "Are you sure you want to clear the cache?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          Alert.alert("Success", "Cache cleared successfully!");
        },
      },
    ]);
  };

  const handleExportData = () => {
    Alert.alert("Export Data", "Your data will be exported to your device.");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert("Account Deleted", "Your account has been deleted.");
          },
        },
      ],
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
          <Text className="text-white text-xl font-bold">Settings</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      {/* Notifications Section */}
      <View className="px-6 mt-8">
        <Text className="text-white text-lg font-bold mb-4">Notifications</Text>

        <View className="bg-slate-800 p-4 rounded-2xl mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#6b7280"
              />
              <View className="ml-4">
                <Text className="text-white font-semibold">
                  Push Notifications
                </Text>
                <Text className="text-gray-400 text-sm">
                  Receive study reminders
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#374151", true: "#3b82f6" }}
              thumbColor={notifications ? "#ffffff" : "#9ca3af"}
            />
          </View>
        </View>

        <View className="bg-slate-800 p-4 rounded-2xl mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="volume-high-outline" size={24} color="#6b7280" />
              <View className="ml-4">
                <Text className="text-white font-semibold">Sound Effects</Text>
                <Text className="text-gray-400 text-sm">
                  Play sounds for actions
                </Text>
              </View>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ false: "#374151", true: "#3b82f6" }}
              thumbColor={soundEffects ? "#ffffff" : "#9ca3af"}
            />
          </View>
        </View>
      </View>

      {/* Appearance Section */}
      <View className="px-6 mt-8">
        <Text className="text-white text-lg font-bold mb-4">Appearance</Text>

        <View className="bg-slate-800 p-4 rounded-2xl mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="moon-outline" size={24} color="#6b7280" />
              <View className="ml-4">
                <Text className="text-white font-semibold">Dark Mode</Text>
                <Text className="text-gray-400 text-sm">Use dark theme</Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#374151", true: "#3b82f6" }}
              thumbColor={darkMode ? "#ffffff" : "#9ca3af"}
            />
          </View>
        </View>
      </View>

      {/* Data & Storage Section */}
      <View className="px-6 mt-8">
        <Text className="text-white text-lg font-bold mb-4">
          Data & Storage
        </Text>

        <View className="bg-slate-800 p-4 rounded-2xl mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="save-outline" size={24} color="#6b7280" />
              <View className="ml-4">
                <Text className="text-white font-semibold">Auto Save</Text>
                <Text className="text-gray-400 text-sm">
                  Automatically save progress
                </Text>
              </View>
            </View>
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: "#374151", true: "#3b82f6" }}
              thumbColor={autoSave ? "#ffffff" : "#9ca3af"}
            />
          </View>
        </View>

        <View className="bg-slate-800 p-4 rounded-2xl mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="cloud-outline" size={24} color="#6b7280" />
              <View className="ml-4">
                <Text className="text-white font-semibold">Cloud Sync</Text>
                <Text className="text-gray-400 text-sm">
                  Sync data across devices
                </Text>
              </View>
            </View>
            <Switch
              value={dataSync}
              onValueChange={setDataSync}
              trackColor={{ false: "#374151", true: "#3b82f6" }}
              thumbColor={dataSync ? "#ffffff" : "#9ca3af"}
            />
          </View>
        </View>

        <TouchableOpacity
          className="bg-slate-800 p-4 rounded-2xl mb-3"
          onPress={handleClearCache}
        >
          <View className="flex-row items-center">
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
            <View className="ml-4">
              <Text className="text-white font-semibold">Clear Cache</Text>
              <Text className="text-gray-400 text-sm">
                Free up storage space
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-slate-800 p-4 rounded-2xl mb-3"
          onPress={handleExportData}
        >
          <View className="flex-row items-center">
            <Ionicons name="download-outline" size={24} color="#10b981" />
            <View className="ml-4">
              <Text className="text-white font-semibold">Export Data</Text>
              <Text className="text-gray-400 text-sm">Download your data</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Account Section */}
      <View className="px-6 mt-8 mb-8">
        <Text className="text-white text-lg font-bold mb-4">Account</Text>

        <TouchableOpacity
          className="bg-red-600 p-4 rounded-2xl"
          onPress={handleDeleteAccount}
        >
          <View className="flex-row items-center">
            <Ionicons name="warning-outline" size={24} color="white" />
            <View className="ml-4">
              <Text className="text-white font-semibold">Delete Account</Text>
              <Text className="text-red-200 text-sm">
                Permanently delete your account
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
