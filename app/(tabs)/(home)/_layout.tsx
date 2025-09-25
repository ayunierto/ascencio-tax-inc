import React from "react";

import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native";
import Logo from "@/components/Logo";
import { theme } from "@/components/ui/theme";

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Logo />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.mutedForeground,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.background,
            paddingTop: 8,
            height: 45,
            elevation: 0,
            shadowOpacity: 0,
          },
          animation: "shift",
          tabBarPosition: "top",
          tabBarIconStyle: { height: 0 },
          tabBarIcon: undefined,
          tabBarLabelStyle: {
            fontSize: 13,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Services",
          }}
        />
        <Tabs.Screen
          name="blog"
          options={{
            title: "Blog",
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
