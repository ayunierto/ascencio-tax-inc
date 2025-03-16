import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '@/components/ui/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'ios_from_right',
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerShadowVisible: false,
        headerShown: false,
      }}
      initialRouteName="sign-in"
    >
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: true,
          title: '',
        }}
      />

      <Stack.Screen
        name="new-password"
        options={{
          title: '',
        }}
      />

      <Stack.Screen
        name="sign-in"
        options={{
          title: '',
        }}
      />

      <Stack.Screen
        name="sign-up"
        options={{
          title: '',
        }}
      />

      <Stack.Screen
        name="verify"
        options={{
          title: '',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
