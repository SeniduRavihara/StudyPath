import React from "react";
import { View } from "react-native";
import AIButton from "./AIButton";

interface TabsWrapperProps {
  children: React.ReactNode;
}

export default function TabsWrapper({ children }: TabsWrapperProps) {
  const handleAIPress = () => {
    // TODO: Implement AI functionality
    console.log("🤖 AI Button pressed from main tabs!");
    console.log(
      "📍 Location: Main app tabs (Home, Feed, Rewards, Profile, Debug)",
    );
    console.log("💡 Future: This will open AI assistant for general app help");

    // Check if we're in study context and provide appropriate help
    // This will be enhanced when we implement the actual AI functionality
  };

  return (
    <View className="flex-1">
      {children}
      <AIButton onPress={handleAIPress} />
    </View>
  );
}
