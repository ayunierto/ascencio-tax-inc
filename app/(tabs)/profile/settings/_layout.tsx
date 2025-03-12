import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '@/components/ui/theme';

const MyProfileLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleAlign: 'center',
        headerTintColor: theme.foreground,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name="delete-account-modal"
        options={{
          presentation: 'modal',
          animation: 'fade',
          // headerShown: false,
          title: '',
        }}
      />
    </Stack>
  );
};

export default MyProfileLayout;
