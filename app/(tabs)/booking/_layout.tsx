import React from 'react';

import { Stack } from 'expo-router';
import { theme } from '@/components/ui/theme';

export default function BookingLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.foreground,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Booking',
        }}
      />
      <Stack.Screen
        name="resume"
        options={{
          title: 'Resume',
        }}
      />
    </Stack>
  );
}
