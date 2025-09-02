import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();

  console.log("Index: User:", user?.email, "Loading:", loading); // Debug log

  if (loading) {
    console.log("Index: Loading - showing spinner"); // Debug log
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0f0f23",
        }}
      >
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  if (!user) {
    console.log("Index: NO USER - Redirecting to login"); // Debug log
    return <Redirect href="/auth/login" />;
  }

  console.log("Index: USER EXISTS - Redirecting to tabs"); // Debug log
  return <Redirect href="/(tabs)" />;
}
