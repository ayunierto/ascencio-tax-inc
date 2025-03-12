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
      }}
      initialRouteName="sign-in"
    >
      <Stack.Screen
        name="forgot-password"
        options={{
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
        name="verify-code-reset-password"
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name="verify"
        options={{
          title: '',
        }}
      />
    </Stack>
  );
}
