import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

type User = {
  name: string;
  avatar: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  points: number;
  streak: number;
  rank: string;
};

type Post = {
  id: number;
  user: User;
  content: string;
  subject: string;
  achievement: string;
  likes: number;
  comments: number;
  time: string;
  liked: boolean;
  type: "achievement" | "question" | "milestone" | "tip";
  xpEarned?: number;
  media?: string;
};

type SubjectColors = {
  [key: string]: [string, string];
};

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b4c12c14?w=150&h=150&fit=crop&crop=face",
        level: "Advanced",
        points: 3420,
        streak: 7,
        rank: "Diamond",
      },
      content:
        "Just completed Chapter 5 of Calculus! The integration techniques are finally clicking. Who else is working on this?",
      subject: "Mathematics",
      achievement: "Chapter Master",
      likes: 24,
      comments: 8,
      time: "2 hours ago",
      liked: false,
      type: "milestone",
      xpEarned: 150,
    },
    {
      id: 2,
      user: {
        name: "Michael Chen",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        level: "Intermediate",
        points: 2100,
        streak: 3,
        rank: "Gold",
      },
      content:
        "Physics lab simulation on wave interference was amazing! The virtual experiments really help understand the concepts.",
      subject: "Physics",
      achievement: "Lab Expert",
      likes: 31,
      comments: 12,
      time: "5 hours ago",
      liked: true,
      type: "achievement",
      xpEarned: 200,
      media:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop",
    },
    {
      id: 3,
      user: {
        name: "Emma Wilson",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        level: "Beginner",
        points: 890,
        streak: 5,
        rank: "Silver",
      },
      content:
        "Finally got my first 100% on a Chemistry quiz! Thanks to everyone who helped me with molecular structures 🎉",
      subject: "Chemistry",
      achievement: "Perfect Score",
      likes: 45,
      comments: 15,
      time: "1 day ago",
      liked: false,
      type: "achievement",
      xpEarned: 300,
    },
    {
      id: 4,
      user: {
        name: "Study Tips Bot",
        avatar:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150&h=150&fit=crop&crop=face",
        level: "Advanced",
        points: 9999,
        streak: 365,
        rank: "Legend",
      },
      content:
        "📚 Pro Tip: Use the Pomodoro Technique (25 min study + 5 min break) to maximize your learning efficiency!",
      subject: "Study Tips",
      achievement: "Daily Tip",
      likes: 89,
      comments: 23,
      time: "3 hours ago",
      liked: false,
      type: "tip",
    },
  ]);

  const handleLike = (postId: number): void => {
    setPosts(
      posts.map(post =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };
  const subjectColors: SubjectColors = {
    Mathematics: ["#667eea", "#764ba2"],
    Physics: ["#f093fb", "#f5576c"],
    Chemistry: ["#4facfe", "#00f2fe"],
    Biology: ["#43e97b", "#38f9d7"],
    "Study Tips": ["#ff9a9e", "#fad0c4"],
  };

  const getPostTypeIcon = (
    type: Post["type"],
  ): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case "achievement":
        return "trophy";
      case "question":
        return "help-circle";
      case "milestone":
        return "flag";
      case "tip":
        return "bulb";
      default:
        return "star";
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-900">
      {/* Header */}
      <LinearGradient
        colors={["#0f0f23", "#1a1a2e"]}
        className="px-6 pt-14 pb-6"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">Study Feed</Text>
            <Text className="text-gray-400 text-base">
              Connect with fellow students
            </Text>
          </View>
          <TouchableOpacity className="bg-slate-800 p-3 rounded-full">
            <Ionicons name="add" size={24} color="#00d4ff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Posts */}
      <View className="px-6 mt-4">
        {posts.map(post => (
          <View key={post.id} className="bg-slate-800 rounded-3xl p-5 mb-4">
            {/* User Info */}
            <View className="flex-row items-center mb-4">
              <Image
                source={{ uri: post.user.avatar }}
                className="w-12 h-12 rounded-full"
              />
              <View className="flex-1 ml-3">
                <View className="flex-row items-center">
                  <Text className="text-white font-bold text-base">
                    {post.user.name}
                  </Text>
                  <View className="bg-blue-500 px-2 py-1 rounded-full ml-2">
                    <Text className="text-white text-xs">
                      {post.user.level}
                    </Text>
                  </View>
                  <View className="bg-yellow-500/20 px-2 py-1 rounded-full ml-2">
                    <Text className="text-yellow-400 text-xs">
                      {post.user.rank}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-gray-400 text-sm">
                    {post.user.points} points
                  </Text>
                  <Text className="text-gray-400 text-sm mx-2">•</Text>
                  <View className="flex-row items-center">
                    <Ionicons name="flame" size={14} color="#FF6B6B" />
                    <Text className="text-red-400 text-sm ml-1">
                      {post.user.streak} days
                    </Text>
                  </View>
                  <Text className="text-gray-400 text-sm mx-2">•</Text>
                  <Text className="text-gray-400 text-sm">{post.time}</Text>
                </View>
              </View>
            </View>

            {/* Subject & Achievement */}
            <View className="flex-row items-center mb-3">
              <LinearGradient
                colors={subjectColors[post.subject] || ["#6b7280", "#4b5563"]}
                className="px-3 py-1 rounded-full mr-2"
              >
                <Text className="text-white text-xs font-semibold">
                  {post.subject}
                </Text>
              </LinearGradient>
              <View className="bg-yellow-500 px-3 py-1 rounded-full">
                <Text className="text-black text-xs font-bold">
                  {post.achievement}
                </Text>
              </View>
              {post.xpEarned && (
                <View className="bg-green-500/20 px-3 py-1 rounded-full ml-2">
                  <Text className="text-green-400 text-xs font-bold">
                    +{post.xpEarned} XP
                  </Text>
                </View>
              )}
            </View>

            {/* Content */}
            <Text className="text-white text-base leading-6 mb-4">
              {post.content}
            </Text>

            {/* Media */}
            {post.media && (
              <Image
                source={{ uri: post.media }}
                className="w-full h-48 rounded-2xl mb-4"
                resizeMode="cover"
              />
            )}

            {/* Actions */}
            <View className="flex-row justify-between items-center pt-4 border-t border-slate-700">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => handleLike(post.id)}
              >
                <Ionicons
                  name={post.liked ? "heart" : "heart-outline"}
                  size={20}
                  color={post.liked ? "#ef4444" : "#6b7280"}
                />
                <Text
                  className={`ml-2 text-sm ${post.liked ? "text-red-400" : "text-gray-400"}`}
                >
                  {post.likes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
                <Text className="text-gray-400 text-sm ml-2">
                  {post.comments}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="share-outline" size={20} color="#6b7280" />
                <Text className="text-gray-400 text-sm ml-2">Share</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center">
                <Ionicons
                  name={getPostTypeIcon(post.type)}
                  size={20}
                  color="#6b7280"
                />
                <Text className="text-gray-400 text-sm ml-2">
                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
