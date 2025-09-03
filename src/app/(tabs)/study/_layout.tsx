/* eslint-disable prettier/prettier */
import { Stack } from "expo-router";
import React from "react";
import StudyWrapper from "../../../components/StudyWrapper";

export default function StudyLayout() {
  return (
    <StudyWrapper>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="topics" />
        <Stack.Screen name="subject" />
        <Stack.Screen name="lesson" />
        <Stack.Screen name="quizzes" />
        <Stack.Screen name="take-quiz" />
      </Stack>
    </StudyWrapper>
  );
}
