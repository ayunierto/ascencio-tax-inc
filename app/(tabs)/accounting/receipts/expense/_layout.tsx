import React from "react";
import { Stack } from "expo-router/stack";
import { theme } from "@/components/ui/theme";

export default function ExpenseLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.foreground,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "List of expenses",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="[id]"
        options={{
          title: "Add expense",
        }}
      />
    </Stack>
  );
}
