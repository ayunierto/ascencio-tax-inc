import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '@/core/auth/store/useAuthStore';
import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';
import { RevenueCatProvider } from '@/providers/RevenueCat';
import { useQuery } from '@tanstack/react-query';
import { CheckStatusResponse } from '@/core/auth/interfaces';

export default function TabLayout() {
  const { status, checkStatus } = useAuthStore();

  const { isPending } = useQuery<CheckStatusResponse>({
    queryKey: ['checkStatus'],
    queryFn: checkStatus,
    staleTime: 1000 * 5, // 5 seconds
    refetchOnWindowFocus: true,
  });

  if (status === 'checking' || isPending) {
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
          animation: 'shift',
        }}
      >
        <Tabs.Screen
          name="(home)"
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
              status === 'authenticated'
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
              status === 'authenticated' ? '/(tabs)/accounting/receipts' : null,
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
            href: status === 'authenticated' ? '/(tabs)/settings' : null,
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
            href: status === 'authenticated' ? null : '/(tabs)/auth/sign-in',
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
