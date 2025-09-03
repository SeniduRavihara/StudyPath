import React from "react";
import { View } from "react-native";

interface StudyWrapperProps {
  children: React.ReactNode;
}

export default function StudyWrapper({ children }: StudyWrapperProps) {
  return <View className="flex-1">{children}</View>;
}
