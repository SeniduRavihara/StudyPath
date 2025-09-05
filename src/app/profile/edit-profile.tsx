import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function EditProfileScreen() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("Passionate learner and knowledge seeker");
  const [location, setLocation] = useState("New York, USA");
  const [website, setWebsite] = useState("");

  const handleSave = () => {
    Alert.alert("Success", "Profile updated successfully!", [
      { text: "OK", onPress: () => router.back() },
    ]);
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
          <Text className="text-white text-xl font-bold">Edit Profile</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text className="text-blue-400 font-semibold">Save</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Profile Picture Section */}
      <View className="items-center py-8">
        <View className="relative">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            }}
            className="w-32 h-32 rounded-full"
          />
          <TouchableOpacity className="absolute -bottom-2 -right-2 bg-blue-500 p-3 rounded-full">
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="mt-4">
          <Text className="text-blue-400 font-semibold">Change Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View className="px-6 space-y-6">
        {/* Name */}
        <View>
          <Text className="text-white font-semibold mb-2">Full Name</Text>
          <TextInput
            className="bg-slate-800 text-white p-4 rounded-2xl"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor="#6b7280"
          />
        </View>

        {/* Email */}
        <View>
          <Text className="text-white font-semibold mb-2">Email</Text>
          <TextInput
            className="bg-slate-800 text-white p-4 rounded-2xl"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#6b7280"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Bio */}
        <View>
          <Text className="text-white font-semibold mb-2">Bio</Text>
          <TextInput
            className="bg-slate-800 text-white p-4 rounded-2xl h-24"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            placeholderTextColor="#6b7280"
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Location */}
        <View>
          <Text className="text-white font-semibold mb-2">Location</Text>
          <TextInput
            className="bg-slate-800 text-white p-4 rounded-2xl"
            value={location}
            onChangeText={setLocation}
            placeholder="Enter your location"
            placeholderTextColor="#6b7280"
          />
        </View>

        {/* Website */}
        <View>
          <Text className="text-white font-semibold mb-2">Website</Text>
          <TextInput
            className="bg-slate-800 text-white p-4 rounded-2xl"
            value={website}
            onChangeText={setWebsite}
            placeholder="Enter your website URL"
            placeholderTextColor="#6b7280"
            autoCapitalize="none"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-2xl mt-8 mb-8"
          onPress={handleSave}
        >
          <Text className="text-white font-semibold text-lg text-center">
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
