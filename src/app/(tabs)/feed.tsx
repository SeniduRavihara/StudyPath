import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FeedPost, FeedService } from "../../lib/feedService";

type SubjectColors = {
  [key: string]: [string, string];
};

export default function FeedScreen() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Load feed posts from Supabase
  const loadFeedPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await FeedService.getFeedPosts();

      if (error) {
        console.error("Error loading feed posts:", error);
        Alert.alert("Error", "Failed to load feed posts");
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error("Error loading feed posts:", error);
      Alert.alert("Error", "Failed to load feed posts");
    } finally {
      setLoading(false);
    }
  };

  // Refresh feed posts
  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeedPosts();
    setRefreshing(false);
  };

  // Handle like/unlike post
  const handleLike = async (postId: string): Promise<void> => {
    try {
      const isLiked = likedPosts.has(postId);

      // Optimistically update UI
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                likes: isLiked ? post.likes - 1 : post.likes + 1,
              }
            : post,
        ),
      );

      // Update in database
      const { error } = isLiked
        ? await FeedService.unlikePost(postId)
        : await FeedService.likePost(postId);

      if (error) {
        console.error("Error updating like:", error);
        // Revert optimistic update
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          if (isLiked) {
            newSet.add(postId);
          } else {
            newSet.delete(postId);
          }
          return newSet;
        });
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? {
                  ...post,
                  likes: isLiked ? post.likes + 1 : post.likes - 1,
                }
              : post,
          ),
        );
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  // Load posts on component mount
  useEffect(() => {
    loadFeedPosts();
  }, []);

  // Set up real-time subscription for feed updates
  useEffect(() => {
    const subscription = FeedService.subscribeToFeedUpdates(payload => {
      console.log("Real-time feed update:", payload);

      if (payload.eventType === "INSERT") {
        // New post added
        setPosts(prevPosts => [payload.new, ...prevPosts]);
      } else if (payload.eventType === "UPDATE") {
        // Post updated (like count, etc.)
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === payload.new.id ? payload.new : post,
          ),
        );
      } else if (payload.eventType === "DELETE") {
        // Post deleted
        setPosts(prevPosts =>
          prevPosts.filter(post => post.id !== payload.old.id),
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const subjectColors: SubjectColors = FeedService.getSubjectColors();

  const getPostTypeIcon = (
    type: FeedPost["type"],
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
    <ScrollView
      className="flex-1 bg-slate-900"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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

      {/* Loading State */}
      {loading && (
        <View className="flex-1 justify-center items-center py-20">
          <Text className="text-gray-400 text-lg">Loading feed posts...</Text>
        </View>
      )}

      {/* Posts */}
      <View className="px-6 mt-4">
        {!loading && posts.length === 0 && (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-400 text-lg">No posts yet</Text>
            <Text className="text-gray-500 text-sm mt-2">
              Be the first to share your study progress!
            </Text>
          </View>
        )}

        {posts.map(post => (
          <View key={post.id} className="bg-slate-800 rounded-3xl p-5 mb-4">
            {/* User Info */}
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center">
                <Text className="text-white font-bold text-lg">
                  {post.users.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View className="flex-1 ml-3">
                <View className="flex-row items-center">
                  <Text className="text-white font-bold text-base">
                    {post.users.name}
                  </Text>
                  <View className="bg-blue-500 px-2 py-1 rounded-full ml-2">
                    <Text className="text-white text-xs">
                      {post.users.level}
                    </Text>
                  </View>
                  <View className="bg-yellow-500/20 px-2 py-1 rounded-full ml-2">
                    <Text className="text-yellow-400 text-xs">
                      {post.users.rank}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-gray-400 text-sm">
                    {post.users.points} points
                  </Text>
                  <Text className="text-gray-400 text-sm mx-2">•</Text>
                  <View className="flex-row items-center">
                    <Ionicons name="flame" size={14} color="#FF6B6B" />
                    <Text className="text-red-400 text-sm ml-1">
                      {post.users.streak} days
                    </Text>
                  </View>
                  <Text className="text-gray-400 text-sm mx-2">•</Text>
                  <Text className="text-gray-400 text-sm">
                    {FeedService.formatTimeAgo(post.created_at)}
                  </Text>
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
              {post.points_earned > 0 && (
                <View className="bg-green-500/20 px-3 py-1 rounded-full ml-2">
                  <Text className="text-green-400 text-xs font-bold">
                    +{post.points_earned} XP
                  </Text>
                </View>
              )}
            </View>

            {/* Content */}
            <Text className="text-white text-base leading-6 mb-4">
              {post.content}
            </Text>

            {/* Media */}
            {post.media_url && (
              <Image
                source={{ uri: post.media_url }}
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
                  name={likedPosts.has(post.id) ? "heart" : "heart-outline"}
                  size={20}
                  color={likedPosts.has(post.id) ? "#ef4444" : "#6b7280"}
                />
                <Text
                  className={`ml-2 text-sm ${likedPosts.has(post.id) ? "text-red-400" : "text-gray-400"}`}
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
