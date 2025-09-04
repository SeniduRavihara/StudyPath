import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
            🚀 Drizzle ORM Tools
          </Text>

          <TouchableOpacity
            className="bg-purple-500 p-4 rounded-xl mb-4"
            onPress={async () => {
              try {
                const drizzleQuizService = await import(
                  "../../lib/drizzleQuizService"
                );
                await drizzleQuizService.default.createSampleQuizzes();
                console.log("✅ Drizzle sample quizzes created!");
              } catch (error) {
                console.error("❌ Drizzle test failed:", error);
              }
            }}
          >
            <Text className="text-white font-semibold text-center text-lg">
              🧪 Test Drizzle ORM
            </Text>
            <Text className="text-purple-100 text-center text-sm mt-1">
              Create sample data with Drizzle
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-500 p-4 rounded-xl mb-4"
            onPress={async () => {
              try {
                const drizzleQuizService = await import(
                  "../../lib/drizzleQuizService"
                );
                const stats =
                  await drizzleQuizService.default.getDatabaseStats();
                console.log("📊 Drizzle Database Stats:", stats);
              } catch (error) {
                console.error("❌ Error getting database stats:", error);
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
                const drizzleQuizService = await import(
                  "../../lib/drizzleQuizService"
                );
                const result =
                  await drizzleQuizService.default.createSampleQuizzes();
                console.log("✅ Drizzle Database re-seeded:", result.message);
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
                // Clear SQLite database
                const drizzleQuizService = await import(
                  "../../lib/drizzleQuizService"
                );
                await drizzleQuizService.default.clearAllData();
                console.log("🗑️ SQLite Database cleared successfully");

                // Reset import flags in Supabase
                const { FeedService } = await import("../../lib/feedService");
                const result = await FeedService.resetAllImportFlags();
                if (result.success) {
                  console.log("✅ Import flags reset successfully");
                  Alert.alert(
                    "Success",
                    "Database cleared and import flags reset!",
                  );
                } else {
                  console.log(
                    "⚠️ Database cleared but import flags reset failed",
                  );
                  Alert.alert(
                    "Partial Success",
                    "Database cleared but import flags reset failed",
                  );
                }
              } catch (error) {
                console.error("❌ Error clearing database:", error);
                Alert.alert("Error", "Failed to clear database");
              }
            }}
          >
            <Text className="text-white font-semibold text-center text-lg">
              🗑️ Clear Database
            </Text>
            <Text className="text-red-100 text-center text-sm mt-1">
              Clear SQLite + Reset Import Flags
            </Text>
          </TouchableOpacity>
        </View>

        {/* Full Reset */}
        <View className="bg-slate-800 p-6 rounded-2xl">
          <Text className="text-white text-lg font-bold mb-4">
            ⚠️ Full Reset
          </Text>

          <TouchableOpacity
            className="bg-red-600 p-4 rounded-xl"
            onPress={async () => {
              Alert.alert(
                "Full Reset",
                "This will clear ALL data and reset import flags. Are you sure?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Reset Everything",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        // Clear SQLite database
                        const drizzleQuizService = await import(
                          "../../lib/drizzleQuizService"
                        );
                        await drizzleQuizService.default.clearAllData();
                        console.log("🗑️ SQLite Database cleared");

                        // Reset import flags in Supabase
                        const { FeedService } = await import(
                          "../../lib/feedService"
                        );
                        const result = await FeedService.resetAllImportFlags();

                        if (result.success) {
                          console.log("✅ Full reset completed successfully");
                          Alert.alert(
                            "Success",
                            "Full reset completed! All data cleared and import flags reset.",
                          );
                        } else {
                          console.log(
                            "⚠️ Partial reset - database cleared but import flags failed",
                          );
                          Alert.alert(
                            "Partial Success",
                            "Database cleared but import flags reset failed",
                          );
                        }
                      } catch (error) {
                        console.error("❌ Error during full reset:", error);
                        Alert.alert("Error", "Failed to complete full reset");
                      }
                    },
                  },
                ],
              );
            }}
          >
            <Text className="text-white font-semibold text-center text-lg">
              🔥 Full Reset Everything
            </Text>
            <Text className="text-red-100 text-center text-sm mt-1">
              Clear ALL data + Reset ALL flags (with confirmation)
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
                const drizzleQuizService = await import(
                  "../../lib/drizzleQuizService"
                );
                const mathQuizzes =
                  await drizzleQuizService.default.getQuizzesBySubject(
                    "Mathematics",
                  );
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
                const drizzleQuizService = await import(
                  "../../lib/drizzleQuizService"
                );
                await drizzleQuizService.default.initialize();
                console.log("🔧 Drizzle Quiz service initialized");
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

        {/* Feed Import Management */}
        <View className="bg-slate-800 p-6 rounded-2xl">
          <Text className="text-white text-lg font-bold mb-4">
            📥 Feed Import Management
          </Text>

          <TouchableOpacity
            className="bg-red-500 p-4 rounded-xl mb-4"
            onPress={async () => {
              try {
                const { FeedService } = await import("../../lib/feedService");
                const result = await FeedService.resetAllImportFlags();
                if (result.success) {
                  console.log("✅ All import flags reset successfully!");
                  Alert.alert("Success", "All import flags have been reset!");
                } else {
                  console.error(
                    "❌ Failed to reset import flags:",
                    result.error,
                  );
                  Alert.alert("Error", "Failed to reset import flags");
                }
              } catch (error) {
                console.error("❌ Error resetting import flags:", error);
                Alert.alert("Error", "Failed to reset import flags");
              }
            }}
          >
            <Text className="text-white font-semibold text-center text-lg">
              🔄 Reset Import Flags
            </Text>
            <Text className="text-red-100 text-center text-sm mt-1">
              Reset all quiz pack import flags in Supabase
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
              <Text className="font-semibold">Database:</Text> SQLite + Drizzle
              ORM
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
            <Text className="text-gray-300">
              <Text className="font-semibold">ORM:</Text> Drizzle (Type-safe)
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View className="bg-slate-800 p-6 rounded-2xl">
          <Text className="text-white text-lg font-bold mb-4">
            📖 Instructions
          </Text>

          <Text className="text-gray-300 text-sm leading-6">
            • <Text className="font-semibold">Test Drizzle ORM:</Text> Creates
            sample data using Drizzle{"\n"}•{" "}
            <Text className="font-semibold">Log Stats:</Text> Prints table
            counts to the console{"\n"}•{" "}
            <Text className="font-semibold">Re-seed:</Text> Clears and adds
            sample quiz data{"\n"}•{" "}
            <Text className="font-semibold">Clear:</Text> Removes all data from
            database{"\n"}•{" "}
            <Text className="font-semibold">Log Math Quizzes:</Text> Shows all
            Mathematics quizzes{"\n"}•{" "}
            <Text className="font-semibold">Initialize:</Text> Force initialize
            Drizzle database{"\n"}•{" "}
            <Text className="font-semibold">Check console:</Text> Open developer
            tools to see logs
          </Text>
        </View>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
