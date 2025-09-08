import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

// Types for learning nodes
export interface LearningNode {
  id: string;
  title: string;
  type: "lesson" | "quiz" | "project" | "milestone";
  status: "locked" | "available" | "completed" | "current";
  difficulty: "easy" | "medium" | "hard";
  xp: number;
  position: { x: number; y: number };
  icon: keyof typeof Ionicons.glyphMap;
  color: [string, string];
  description?: string;
  estimatedTime?: string;
}

interface LearningFlowPathProps {
  nodes: LearningNode[];
  onNodePress: (node: LearningNode) => void;
  userStats: {
    hearts: number;
    coins: number;
    streak: number;
    totalXp: number;
  };
  courseTitle: string;
  courseProgress: number;
}

// Generate flow path between nodes
const generateFlowPath = (nodes: LearningNode[]): string => {
  if (nodes.length < 2) return "";

  const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);
  let path = `M ${sortedNodes[0].position.x} ${sortedNodes[0].position.y}`;

  for (let i = 1; i < sortedNodes.length; i++) {
    const prevNode = sortedNodes[i - 1];
    const currentNode = sortedNodes[i];

    // Create smooth curves between nodes
    const controlPoint1X =
      prevNode.position.x +
      (currentNode.position.x - prevNode.position.x) * 0.3;
    const controlPoint1Y = prevNode.position.y + 50;
    const controlPoint2X =
      currentNode.position.x -
      (currentNode.position.x - prevNode.position.x) * 0.3;
    const controlPoint2Y = currentNode.position.y - 50;

    path += ` C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${currentNode.position.x} ${currentNode.position.y}`;
  }

  return path;
};

// Node component with animations
const LearningNodeComponent: React.FC<{
  node: LearningNode;
  onPress: () => void;
  index: number;
}> = ({ node, onPress, index }) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [pulseAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Pulse animation for current node
  React.useEffect(() => {
    if (node.status === "current") {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [node.status, pulseAnim]);

  const getNodeSize = () => {
    switch (node.status) {
      case "current":
        return 80;
      case "completed":
        return 70;
      case "available":
        return 65;
      case "locked":
        return 60;
      default:
        return 65;
    }
  };

  const getNodeIcon = () => {
    switch (node.status) {
      case "completed":
        return "checkmark-circle";
      case "locked":
        return "lock-closed";
      case "current":
        return "play-circle";
      default:
        return node.icon;
    }
  };

  const getNodeColor = () => {
    switch (node.status) {
      case "completed":
        return ["#10b981", "#059669"];
      case "current":
        return ["#8b5cf6", "#7c3aed"];
      case "locked":
        return ["#6b7280", "#4b5563"];
      default:
        return node.color;
    }
  };

  const nodeSize = getNodeSize();
  const isDisabled = node.status === "locked";

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: node.position.x - nodeSize / 2,
        top: node.position.y - nodeSize / 2,
        transform: [
          { scale: scaleAnim },
          { scale: node.status === "current" ? pulseAnim : 1 },
        ],
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={getNodeColor()}
          className="rounded-full items-center justify-center shadow-lg"
          style={{
            width: nodeSize,
            height: nodeSize,
            shadowColor: getNodeColor()[0],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons
            name={getNodeIcon() as any}
            size={nodeSize * 0.4}
            color="white"
          />
        </LinearGradient>

        {/* Node label */}
        <View
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
          style={{ minWidth: 100 }}
        >
          <Text
            className="text-center text-xs font-semibold"
            style={{
              color: node.status === "locked" ? "#6b7280" : "#ffffff",
            }}
            numberOfLines={2}
          >
            {node.title}
          </Text>
          {node.xp > 0 && (
            <Text
              className="text-center text-xs mt-1"
              style={{
                color: node.status === "locked" ? "#6b7280" : "#fbbf24",
              }}
            >
              +{node.xp} XP
            </Text>
          )}
        </View>

        {/* Difficulty indicator */}
        {node.status !== "locked" && (
          <View
            className="absolute -top-2 -right-2 bg-white rounded-full px-2 py-1"
            style={{ minWidth: 20 }}
          >
            <Text
              className="text-xs font-bold text-center"
              style={{
                color:
                  node.difficulty === "easy"
                    ? "#10b981"
                    : node.difficulty === "medium"
                      ? "#f59e0b"
                      : "#ef4444",
              }}
            >
              {node.difficulty === "easy"
                ? "E"
                : node.difficulty === "medium"
                  ? "M"
                  : "H"}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const LearningFlowPath: React.FC<LearningFlowPathProps> = ({
  nodes,
  onNodePress,
  userStats,
  courseTitle,
  courseProgress,
}) => {
  const [scrollY] = useState(new Animated.Value(0));

  const flowPath = generateFlowPath(nodes);

  return (
    <View className="flex-1 bg-slate-900">
      {/* Header with gamification elements */}
      <LinearGradient
        colors={["#0f0f23", "#1a1a2e"]}
        className="px-6 pt-14 pb-6"
      >
        {/* User Stats */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row space-x-4">
            {/* Hearts */}
            <View className="bg-red-500 bg-opacity-20 px-4 py-2 rounded-full flex-row items-center">
              <Ionicons name="heart" size={20} color="#ef4444" />
              <Text className="text-white font-bold ml-2">
                {userStats.hearts}
              </Text>
            </View>

            {/* Coins */}
            <View className="bg-yellow-500 bg-opacity-20 px-4 py-2 rounded-full flex-row items-center">
              <Ionicons name="diamond" size={20} color="#fbbf24" />
              <Text className="text-white font-bold ml-2">
                {userStats.coins}
              </Text>
            </View>

            {/* Streak */}
            <View className="bg-orange-500 bg-opacity-20 px-4 py-2 rounded-full flex-row items-center">
              <Ionicons name="flame" size={20} color="#f97316" />
              <Text className="text-white font-bold ml-2">
                {userStats.streak}
              </Text>
            </View>
          </View>

          {/* Menu */}
          <TouchableOpacity className="bg-slate-800 p-3 rounded-full">
            <Ionicons name="menu" size={24} color="#00d4ff" />
          </TouchableOpacity>
        </View>

        {/* Course Title */}
        <View className="bg-slate-800 bg-opacity-50 px-6 py-4 rounded-2xl mb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold">
                {courseTitle}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                {Math.round(courseProgress)}% Complete
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-white text-xl font-bold">
                {userStats.totalXp}
              </Text>
              <Text className="text-gray-400 text-xs">Total XP</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="bg-slate-700 rounded-full h-3 mt-3">
            <LinearGradient
              colors={["#8b5cf6", "#7c3aed"]}
              className="rounded-full h-3"
              style={{ width: `${courseProgress}%` }}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Learning Flow Path */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View
          className="relative"
          style={{
            minHeight: Math.max(...nodes.map(n => n.position.y)) + 200,
            width: screenWidth,
          }}
        >
          {/* Flow Path SVG */}
          <Svg
            height="100%"
            width="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <Path
              d={flowPath}
              stroke="#4b5563"
              strokeWidth="4"
              fill="none"
              strokeDasharray="8,4"
              opacity={0.6}
            />
          </Svg>

          {/* Learning Nodes */}
          {nodes.map((node, index) => (
            <LearningNodeComponent
              key={node.id}
              node={node}
              onPress={() => onNodePress(node)}
              index={index}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Info Panel */}
      <View className="absolute bottom-0 left-0 right-0 bg-slate-800 bg-opacity-95 backdrop-blur-sm p-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white font-semibold">
              Next:{" "}
              {nodes.find(n => n.status === "current")?.title ||
                "Complete the course!"}
            </Text>
            <Text className="text-gray-400 text-sm">
              {nodes.filter(n => n.status === "completed").length} of{" "}
              {nodes.length} completed
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="trophy" size={20} color="#fbbf24" />
            <Text className="text-yellow-400 font-bold ml-1">
              {Math.round(courseProgress)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LearningFlowPath;
