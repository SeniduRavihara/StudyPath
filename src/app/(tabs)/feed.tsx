import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
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

  // Comments dialog state
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

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
      case "quiz_pack":
        return "library";
      case "lesson_pack":
        return "school";
      default:
        return "star";
    }
  };

  const handleImportPack = async (post: FeedPost) => {
    try {
      const result = await FeedService.importMCQPack(post.id);
      if (result.success) {
        Alert.alert(
          "Success",
          result.message || "Quiz pack imported successfully!",
        );
        // Refresh the feed to show updated pack status
        loadFeedPosts();
      } else {
        Alert.alert(
          result.error === "Already imported" ? "Already Imported" : "Error",
          result.message || "Failed to import quiz pack",
        );
      }
    } catch (error) {
      console.error("Error importing pack:", error);
      Alert.alert("Error", "Failed to import quiz pack");
    }
  };

  // Handle opening comments dialog
  const handleOpenComments = async (postId: string) => {
    setSelectedPostId(postId);
    setCommentsModalVisible(true);
    setLoadingComments(true);

    try {
      const { data, error } = await FeedService.getComments(postId);
      if (error) {
        console.error("Error loading comments:", error);
        Alert.alert("Error", "Failed to load comments");
      } else {
        setComments(data || []);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      Alert.alert("Error", "Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPostId) return;

    try {
      const { data, error } = await FeedService.createComment(
        selectedPostId,
        newComment.trim(),
      );
      if (error) {
        console.error("Error creating comment:", error);
        Alert.alert("Error", "Failed to add comment");
      } else {
        // Add the new comment to the list
        setComments(prev => [...prev, data]);
        setNewComment("");

        // Update the post's comment count
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === selectedPostId
              ? { ...post, comments: post.comments + 1 }
              : post,
          ),
        );
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      Alert.alert("Error", "Failed to add comment");
    }
  };

  // Handle closing comments dialog
  const handleCloseComments = () => {
    setCommentsModalVisible(false);
    setSelectedPostId(null);
    setComments([]);
    setNewComment("");
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

            {/* Import Button for Educational Packs */}
            {(post.type === "quiz_pack" || post.type === "lesson_pack") && (
              <View className="mb-4">
                {post.pack_data?.imported ? (
                  <View className="bg-green-500/20 p-3 rounded-2xl flex-row items-center justify-center border border-green-500/30">
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#10b981"
                    />
                    <Text className="text-green-400 font-semibold ml-2">
                      {post.type === "quiz_pack"
                        ? "Quiz Pack Imported"
                        : "Lesson Pack Imported"}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    className="bg-blue-500 p-3 rounded-2xl flex-row items-center justify-center"
                    onPress={() => handleImportPack(post)}
                  >
                    <Ionicons name="download" size={20} color="white" />
                    <Text className="text-white font-semibold ml-2">
                      {post.type === "quiz_pack"
                        ? "Import Quiz Pack"
                        : "Import Lesson Pack"}
                    </Text>
                  </TouchableOpacity>
                )}
                {post.pack_data && (
                  <View className="mt-2 bg-blue-500/10 p-3 rounded-xl">
                    <Text className="text-blue-400 text-sm text-center">
                      📚 {post.pack_data.question_count || 0} questions •{" "}
                      {post.pack_data.difficulty || "Medium"} level
                      {post.pack_data?.imported && (
                        <Text className="text-green-400">
                          {" "}
                          • Added to {post.subject}
                        </Text>
                      )}
                    </Text>
                  </View>
                )}
              </View>
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

              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => handleOpenComments(post.id)}
              >
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

      {/* Comments Modal */}
      <Modal
        visible={commentsModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseComments}
      >
        <TouchableOpacity
          className="flex-1 bg-black/80 backdrop-blur-xl justify-start items-center px-5 pt-16"
          activeOpacity={1}
          onPress={handleCloseComments}
        >
          <TouchableOpacity
            className="bg-slate-900 rounded-3xl w-full max-w-md border border-slate-700/50"
            style={{ height: "90%" }}
            activeOpacity={1}
            onPress={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View className="px-6 py-4 rounded-t-3xl">
              <View className="flex-row items-center justify-end">
                <TouchableOpacity
                  onPress={handleCloseComments}
                  className="bg-slate-700/80 p-2 rounded-full"
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Comments List */}
            <ScrollView className="flex-1 px-6">
              {loadingComments ? (
                <View className="flex-1 justify-center items-center py-20">
                  <Text className="text-gray-400 text-lg">
                    Loading comments...
                  </Text>
                </View>
              ) : comments.length === 0 ? (
                <View className="flex-1 justify-center items-center py-20">
                  <Text className="text-gray-400 text-lg">No comments yet</Text>
                  <Text className="text-gray-500 text-sm mt-2">
                    Be the first to comment!
                  </Text>
                </View>
              ) : (
                <View className="py-4">
                  {comments.map(comment => (
                    <View
                      key={comment.id}
                      className="bg-slate-800 rounded-2xl p-4 mb-4"
                    >
                      {/* Comment User Info */}
                      <View className="flex-row items-center mb-3">
                        <View className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center">
                          <Text className="text-white font-bold text-sm">
                            {comment.users?.name?.charAt(0)?.toUpperCase() ||
                              "?"}
                          </Text>
                        </View>
                        <View className="flex-1 ml-3">
                          <View className="flex-row items-center">
                            <Text className="text-white font-semibold text-sm">
                              {comment.users?.name || "Unknown User"}
                            </Text>
                            <View className="bg-blue-500 px-2 py-1 rounded-full ml-2">
                              <Text className="text-white text-xs">
                                {comment.users?.level || "Beginner"}
                              </Text>
                            </View>
                          </View>
                          <Text className="text-gray-400 text-xs">
                            {FeedService.formatTimeAgo(comment.created_at)}
                          </Text>
                        </View>
                      </View>

                      {/* Comment Content */}
                      <Text className="text-white text-sm leading-5">
                        {comment.content}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            {/* Comment Input */}
            <View className="bg-slate-800 p-4 border-t border-slate-700/50 rounded-b-3xl">
              <View className="flex-row items-end">
                <TextInput
                  className="flex-1 bg-slate-700 text-white p-3 rounded-2xl mr-3 max-h-20"
                  placeholder="Write a comment..."
                  placeholderTextColor="#9ca3af"
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  onPress={handleAddComment}
                  disabled={!newComment.trim()}
                  className={`p-3 rounded-2xl ${
                    newComment.trim() ? "bg-blue-500" : "bg-slate-600"
                  }`}
                >
                  <Ionicons
                    name="send"
                    size={20}
                    color={newComment.trim() ? "white" : "#6b7280"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}
