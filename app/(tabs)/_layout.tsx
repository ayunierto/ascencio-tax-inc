import React from 'react';
import { Tabs } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '@/core/auth/store/useAuthStore';
import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';
import { RevenueCatProvider } from '@/providers/RevenueCat';

export default function TabLayout() {
  const { checkAuthStatus, authStatus } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: checkAuthStatus,
    retry: false,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <RevenueCatProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.mutedForeground,
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.background,
            paddingTop: 4,
            height: 65,
          },
          animation: 'fade',
        }}
      >
        <Tabs.Screen
          name="(home)/index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={28}
                name={focused ? 'home' : 'home-outline'}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="my-bookings"
          options={{
            href:
              authStatus === 'authenticated'
                ? '/(tabs)/my-bookings/bookings'
                : null,
            title: 'My Bookings',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={28}
                name={focused ? 'calendar' : 'calendar-outline'}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="accounting"
          options={{
            href:
              authStatus === 'authenticated'
                ? '/(tabs)/accounting/receipts'
                : null,
            title: 'Receipts',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={28}
                name={focused ? 'receipt' : 'receipt-outline'}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            href: authStatus === 'authenticated' ? '/(tabs)/settings' : null,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={28}
                name={focused ? 'settings' : 'settings-outline'}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="booking"
          options={{
            href: null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="auth"
          options={{
            title: 'User',
            href:
              authStatus === 'authenticated' ? null : '/(tabs)/auth/sign-in',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={28}
                name={focused ? 'person' : 'person-outline'}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </RevenueCatProvider>
  );
}
