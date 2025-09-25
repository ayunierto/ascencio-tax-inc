import React from "react";
import { Stack } from "expo-router";
import { theme } from "@/components/ui/theme";

export default function MyProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleAlign: "center",
        headerTintColor: theme.foreground,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "",
        }}
      />

      <Stack.Screen
        name="profile/index"
        options={{
          title: "Account info",
        }}
      />

      <Stack.Screen
        name="profile/delete-account-modal"
        options={{
          presentation: "modal",
          animation: "default",
          title: "",
        }}
      />

      <Stack.Screen
        name="subscriptions/index"
        options={{
          title: "Subscriptions",
        }}
      />
    </Stack>
  );
}
