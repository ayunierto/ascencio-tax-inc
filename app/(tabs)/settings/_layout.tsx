import React, { useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import { theme } from '@/components/ui/theme';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import Loader from '@/components/Loader';

const MyProfileLayout = () => {
  const { status, checkStatus } = useAuthStore();

  // Checking auth status
  useEffect(() => {
    checkStatus();
  }, [status]);

  if (status === 'checking') {
    return <Loader />;
  }

  if (status === 'unauthenticated') {
    return <Redirect href={'/auth/sign-in'} />;
  }

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
        name="profile/index"
        options={{
          title: 'Account info',
        }}
      />

      <Stack.Screen
        name="profile/delete-account-modal"
        options={{
          presentation: 'modal',
          animation: 'default',
          title: '',
        }}
      />

      <Stack.Screen
        name="subscriptions/index"
        options={{
          title: 'Subscriptions',
        }}
      />
    </Stack>
  );
};

export default MyProfileLayout;
