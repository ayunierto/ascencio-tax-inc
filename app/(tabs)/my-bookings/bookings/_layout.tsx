import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { theme } from "@/components/ui/theme";

export default function MyBookingsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          paddingTop: 15,
          height: 55,
          elevation: 0,
          shadowOpacity: 0,
        },
        animation: "shift",
        tabBarPosition: "top",
        tabBarLabelPosition: "beside-icon",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Scheduled",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="event-available" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="past"
        options={{
          title: "Past",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="event-busy" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
