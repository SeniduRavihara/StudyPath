import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, TouchableOpacity, View } from "react-native";

interface AIButtonProps {
  onPress: () => void;
  size?: number;
}

export default function AIButton({ onPress, size = 60 }: AIButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const screenHeight = Dimensions.get("window").height;

  // Responsive positioning based on screen height
  const bottomPosition = screenHeight > 800 ? "bottom-28" : "bottom-24";

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View className={`absolute ${bottomPosition} right-6 z-50`}>
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2, // Perfectly round
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 12,
          }}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2", "#f093fb"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full h-full items-center justify-center"
            style={{
              borderRadius: size / 2, // Ensure gradient is perfectly round
            }}
          >
            {/* AI Brain Icon */}
            <View className="relative">
              <Ionicons name="sparkles" size={size * 0.4} color="white" />

              {/* Animated dots */}
              <View className="absolute -top-1 -right-1">
                <View className="w-2 h-2 bg-yellow-300 rounded-full opacity-80" />
              </View>
              <View className="absolute -bottom-1 -left-1">
                <View className="w-1.5 h-1.5 bg-blue-300 rounded-full opacity-80" />
              </View>
              <View className="absolute -top-0.5 -left-1">
                <View className="w-1 h-1 bg-green-300 rounded-full opacity-80" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
