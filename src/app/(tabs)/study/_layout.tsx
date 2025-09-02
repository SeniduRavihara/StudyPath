/* eslint-disable prettier/prettier */
import { Stack } from "expo-router";
import React from "react";

export default function StudyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="subject" />
      <Stack.Screen name="lesson" />
    </Stack>
  );
}
