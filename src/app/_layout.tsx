import { DataProvider } from "@/contexts/DataContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../../global.css";
import { validateEnv } from "../config/env";
import { AuthProvider } from "../contexts/AuthContext";

// Validate environment variables
validateEnv();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <DataProvider>
          <StatusBar style="light" backgroundColor="#0f0f23" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/signup" />
          </Stack>
        </DataProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
