import { Stack } from "expo-router";
import React from "react";
import DatabaseViewer from "../../components/DatabaseViewer";

export default function DatabaseDebugScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Database Viewer",
          headerShown: true,
          headerStyle: { backgroundColor: "#1a1a2e" },
          headerTintColor: "#fff",
        }}
      />
      <DatabaseViewer />
    </>
  );
}
