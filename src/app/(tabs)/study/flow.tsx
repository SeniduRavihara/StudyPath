import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import LearningFlowPath, {
  LearningNode,
} from "../../../components/LearningFlowPath";
import { useAuth } from "../../../contexts/AuthContext";

export default function FlowStudyScreen() {
  const router = useRouter();
  const { subject } = useLocalSearchParams();
  const parsedSubject = subject ? JSON.parse(subject as string) : null;
  const { user } = useAuth();

  // Mock learning nodes - in real app, this would come from your database
  const [learningNodes, setLearningNodes] = useState<LearningNode[]>([
    // Introduction nodes
    {
      id: "intro-1",
      title: "Welcome",
      type: "lesson",
      status: "completed",
      difficulty: "easy",
      xp: 10,
      position: { x: screenWidth / 2, y: 100 },
      icon: "book",
      color: ["#667eea", "#764ba2"],
      description: "Introduction to the course",
      estimatedTime: "2 min",
    },
    {
      id: "intro-2",
      title: "Basics",
      type: "lesson",
      status: "completed",
      difficulty: "easy",
      xp: 15,
      position: { x: screenWidth / 2 - 80, y: 200 },
      icon: "school",
      color: ["#4ecdc4", "#44a08d"],
      description: "Learn the fundamentals",
      estimatedTime: "5 min",
    },
    {
      id: "intro-3",
      title: "First Quiz",
      type: "quiz",
      status: "completed",
      difficulty: "easy",
      xp: 20,
      position: { x: screenWidth / 2 + 80, y: 200 },
      icon: "help-circle",
      color: ["#f093fb", "#f5576c"],
      description: "Test your knowledge",
      estimatedTime: "3 min",
    },

    // Current section
    {
      id: "current-1",
      title: "Variables",
      type: "lesson",
      status: "current",
      difficulty: "medium",
      xp: 25,
      position: { x: screenWidth / 2, y: 300 },
      icon: "code-slash",
      color: ["#ff6b6b", "#ee5a24"],
      description: "Understanding variables",
      estimatedTime: "8 min",
    },

    // Available nodes
    {
      id: "available-1",
      title: "Functions",
      type: "lesson",
      status: "available",
      difficulty: "medium",
      xp: 30,
      position: { x: screenWidth / 2 - 100, y: 400 },
      icon: "git-branch",
      color: ["#45b7d1", "#96ceb4"],
      description: "Learn about functions",
      estimatedTime: "10 min",
    },
    {
      id: "available-2",
      title: "Practice",
      type: "quiz",
      status: "available",
      difficulty: "medium",
      xp: 35,
      position: { x: screenWidth / 2 + 100, y: 400 },
      icon: "fitness",
      color: ["#96ceb4", "#feca57"],
      description: "Practice what you learned",
      estimatedTime: "5 min",
    },

    // Locked nodes
    {
      id: "locked-1",
      title: "Objects",
      type: "lesson",
      status: "locked",
      difficulty: "hard",
      xp: 40,
      position: { x: screenWidth / 2 - 60, y: 500 },
      icon: "cube",
      color: ["#ff9ff3", "#54a0ff"],
      description: "Working with objects",
      estimatedTime: "12 min",
    },
    {
      id: "locked-2",
      title: "Arrays",
      type: "lesson",
      status: "locked",
      difficulty: "hard",
      xp: 45,
      position: { x: screenWidth / 2 + 60, y: 500 },
      icon: "list",
      color: ["#a8e6cf", "#ffd3a5"],
      description: "Understanding arrays",
      estimatedTime: "10 min",
    },

    // Project milestone
    {
      id: "project-1",
      title: "First Project",
      type: "project",
      status: "locked",
      difficulty: "hard",
      xp: 100,
      position: { x: screenWidth / 2, y: 600 },
      icon: "rocket",
      color: ["#667eea", "#764ba2"],
      description: "Build your first project",
      estimatedTime: "30 min",
    },

    // Advanced section
    {
      id: "advanced-1",
      title: "Async/Await",
      type: "lesson",
      status: "locked",
      difficulty: "hard",
      xp: 50,
      position: { x: screenWidth / 2 - 80, y: 700 },
      icon: "time",
      color: ["#ffaaa5", "#ff8b94"],
      description: "Asynchronous programming",
      estimatedTime: "15 min",
    },
    {
      id: "advanced-2",
      title: "Final Quiz",
      type: "quiz",
      status: "locked",
      difficulty: "hard",
      xp: 75,
      position: { x: screenWidth / 2 + 80, y: 700 },
      icon: "trophy",
      color: ["#dcedc1", "#ffd3a5"],
      description: "Final assessment",
      estimatedTime: "20 min",
    },

    // Final project
    {
      id: "final-project",
      title: "Capstone",
      type: "project",
      status: "locked",
      difficulty: "hard",
      xp: 200,
      position: { x: screenWidth / 2, y: 800 },
      icon: "medal",
      color: ["#00d4ff", "#0099cc"],
      description: "Final capstone project",
      estimatedTime: "60 min",
    },
  ]);

  // Mock user stats based on subject data
  const userStats = {
    hearts: 5,
    coins: 200,
    streak: parsedSubject?.streak || 7,
    totalXp: parsedSubject?.xp || 1250,
  };

  // Calculate course progress
  const completedNodes = learningNodes.filter(
    node => node.status === "completed",
  ).length;
  const totalNodes = learningNodes.length;
  const courseProgress = (completedNodes / totalNodes) * 100;

  const handleNodePress = (node: LearningNode) => {
    if (node.status === "locked") {
      Alert.alert(
        "Locked Content",
        "Complete the previous lessons to unlock this content.",
        [{ text: "OK" }],
      );
      return;
    }

    // Navigate based on node type
    switch (node.type) {
      case "lesson":
        Alert.alert(
          "Start Lesson",
          `Start "${node.title}"?\n\n${node.description}\nEstimated time: ${node.estimatedTime}`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Start",
              onPress: () => {
                // Navigate to lesson
                router.push({
                  pathname: "/study/lesson",
                  params: {
                    lessonId: node.id,
                    lessonTitle: node.title,
                  },
                });
              },
            },
          ],
        );
        break;

      case "quiz":
        Alert.alert(
          "Start Quiz",
          `Start "${node.title}"?\n\n${node.description}\nEstimated time: ${node.estimatedTime}`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Start",
              onPress: () => {
                // Navigate to quiz
                router.push({
                  pathname: "/study/take-quiz",
                  params: {
                    quizId: node.id,
                    quizTitle: node.title,
                  },
                });
              },
            },
          ],
        );
        break;

      case "project":
        Alert.alert(
          "Start Project",
          `Start "${node.title}"?\n\n${node.description}\nEstimated time: ${node.estimatedTime}`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Start",
              onPress: () => {
                // Navigate to project
                Alert.alert("Coming Soon", "Project feature coming soon!");
              },
            },
          ],
        );
        break;

      case "milestone":
        Alert.alert(
          "Milestone Reached!",
          `Congratulations! You've completed "${node.title}".\n\n+${node.xp} XP earned!`,
          [{ text: "Awesome!" }],
        );
        break;
    }
  };

  if (!parsedSubject) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <Text className="text-white text-lg">No subject selected</Text>
      </View>
    );
  }

  return (
    <LearningFlowPath
      nodes={learningNodes}
      onNodePress={handleNodePress}
      userStats={userStats}
      courseTitle={parsedSubject.name || "Full-Stack Developer"}
      courseProgress={courseProgress}
    />
  );
}

// Import screenWidth from Dimensions
import { Dimensions } from "react-native";
const { width: screenWidth } = Dimensions.get("window");
