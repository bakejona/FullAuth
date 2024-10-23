import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerTitle: "home",
      }}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="profle" options={{ headerShown: false }} />
    </Tabs>
  );
}
