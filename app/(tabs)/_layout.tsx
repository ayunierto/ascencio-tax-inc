import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '@/core/auth/store/useAuthStore';
import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';

export default function TabLayout() {
  const { status, checkStatus } = useAuthStore();

  useEffect(() => {
    checkStatus();
  }, []);

  if (status === 'checking') {
    return <Loader />;
  }

  return (
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
          title: 'My Sites',
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
            status === 'authenticated' ? '/(tabs)/my-bookings/bookings' : null,
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
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
