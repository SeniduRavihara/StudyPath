import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function DebugScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-slate-900">
      <LinearGradient
        colors={["#0f0f23", "#1a1a2e"]}
        className="px-6 pt-14 pb-8"
      >
        <Text className="text-white text-2xl font-bold">Debug Tools</Text>
        <Text className="text-gray-400 text-base">
          Developer utilities and database tools
        </Text>
      </LinearGradient>

      <View className="px-6 mt-8 space-y-6">
        {/* Database Tools */}
        <View className="bg-slate-800 p-6 rounded-2xl">
          <Text className="text-white text-lg font-bold mb-4">
            📊 Database Tools
          </Text>

          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-xl mb-4"
            onPress={() => router.push("/debug/database")}
          >
            <Text className="text-white font-semibold text-center text-lg">
              🔍 View Database
            </Text>
            <Text className="text-blue-100 text-center text-sm mt-1">
              Browse all tables and data
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-500 p-4 rounded-xl mb-4"
            onPress={async () => {
              try {
                const { database } = await import("../../lib/database");
                await database.getTableInfo();
                console.log("✅ Database stats logged to console");
              } catch (error) {
                console.error("❌ Error getting table info:", error);
              }
            }}
          >
            <Text className="text-white font-semibold text-center text-lg">
              📈 Log Database Stats
            </Text>
            <Text className="text-green-100 text-center text-sm mt-1">
              Print table counts to console
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-orange-500 p-4 rounded-xl mb-4"
            onPress={async () => {
              try {
                const { seedDatabase } = await import("../../lib/seedDatabase");
                const result = await seedDatabase();
                console.log("✅ Database re-seeded:", result.message);
              } catch (error) {
                console.error("❌ Error seeding database:", error);
              }
            }}
          >
            <Text className="text-white font-semibold text-center text-lg">
              🌱 Re-seed Database
            </Text>
            <Text className="text-orange-100 text-center text-sm mt-1">
              Clear and add sample data
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 p-4 rounded-xl"
            onPress={async () => {
              try {
                const { database } = await import("../../lib/database");
                await database.clearAllData();
                console.log("🗑️ Database cleared successfully");
              } catch (error) {
                console.error("❌ Error clearing database:", error);
              }
            }}
          >
            <Text className="text-white font-semibold text-center text-lg">
              🗑️ Clear Database
            </Text>
            <Text className="text-red-100 text-center text-sm mt-1">
              Remove all data (careful!)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quiz Tools */}
        <View className="bg-slate-800 p-6 rounded-2xl">
          <Text className="text-white text-lg font-bold mb-4">
            🎯 Quiz Tools
          </Text>

          <TouchableOpacity
            className="bg-purple-500 p-4 rounded-xl mb-4"
            onPress={async () => {
              try {
                const quizService = await import("../../lib/quizService");
                const mathQuizzes =
                  await quizService.default.getQuizzesBySubject("Mathematics");
                console.log("📚 Mathematics Quizzes:", mathQuizzes);
              } catch (error) {
                console.error("❌ Error loading quizzes:", error);
              }
            }}
          >
            <Text className="text-white font-semibold text-center text-lg">
              📚 Log Math Quizzes
            </Text>
            <Text className="text-purple-100 text-center text-sm mt-1">
              Show all Mathematics quizzes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-indigo-500 p-4 rounded-xl"
            onPress={async () => {
              try {
                const quizService = await import("../../lib/quizService");
                await quizService.default.initialize();
                console.log("🔧 Quiz service initialized");
              } catch (error) {
                console.error("❌ Error initializing quiz service:", error);
              }
            }}
          >
            <Text className="text-white font-semibold text-center text-lg">
              🔧 Initialize Quiz Service
            </Text>
            <Text className="text-indigo-100 text-center text-sm mt-1">
              Force initialize database
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="bg-slate-800 p-6 rounded-2xl">
          <Text className="text-white text-lg font-bold mb-4">ℹ️ App Info</Text>

          <View className="space-y-2">
            <Text className="text-gray-300">
              <Text className="font-semibold">Version:</Text> 1.0.0
            </Text>
            <Text className="text-gray-300">
              <Text className="font-semibold">Database:</Text> SQLite
              (expo-sqlite)
            </Text>
            <Text className="text-gray-300">
              <Text className="font-semibold">Platform:</Text> Expo SDK 51
            </Text>
            <Text className="text-gray-300">
              <Text className="font-semibold">Database Location:</Text> App
              Internal Storage
            </Text>
            <Text className="text-gray-300">
              <Text className="font-semibold">Database File:</Text> studypath.db
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View className="bg-slate-800 p-6 rounded-2xl">
          <Text className="text-white text-lg font-bold mb-4">
            📖 Instructions
          </Text>

          <Text className="text-gray-300 text-sm leading-6">
            • <Text className="font-semibold">View Database:</Text> Opens a
            detailed viewer showing all tables{"\n"}•{" "}
            <Text className="font-semibold">Log Stats:</Text> Prints table
            counts to the console{"\n"}•{" "}
            <Text className="font-semibold">Re-seed:</Text> Clears and adds
            sample quiz data{"\n"}•{" "}
            <Text className="font-semibold">Clear:</Text> Removes all data from
            database{"\n"}•{" "}
            <Text className="font-semibold">Check console:</Text> Open developer
            tools to see logs
          </Text>
        </View>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
