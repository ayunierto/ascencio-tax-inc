import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '@/components/ui/theme';

const MyBookingsLayout = (): JSX.Element => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleAlign: 'center',
        headerTintColor: theme.foreground,
        title: 'Bookings',
        headerShadowVisible: false,
      }}
    />
  );
};

export default MyBookingsLayout;
