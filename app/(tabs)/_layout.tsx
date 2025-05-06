import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '@/core/auth/store/useAuthStore';
import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';
import { RevenueCatProvider } from '@/providers/RevenueCat';
import { Exception } from '@/core/interfaces/exception.interface';
import Toast from 'react-native-toast-message';

export default function TabLayout() {
  const { status, checkStatus } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await checkStatus();
      if (!('token' in response)) {
        console.error(
          'Error caught by checkStatus in main layout:',
          response.error
        );

        let errorMessage = 'An unexpected error occurred. Please try again.';
        let errorTitle = 'Error';

        // Intenta extraer la información del error original adjunto
        const originalException = response as Exception | undefined;

        if (originalException) {
          errorMessage = originalException.message || errorMessage;
          // Podrías diferenciar entre errores de red y otros errores basados en statusCode o el mensaje
          if (
            originalException.error === 'Network Error' ||
            originalException.statusCode === 408
          ) {
            errorTitle = 'Network Error';
            errorMessage = response.message || errorMessage;
            Toast.show({
              type: 'error',
              text1: errorTitle,
              text2: errorMessage,
            });
          } else if (originalException.statusCode >= 500) {
            errorTitle = 'Server Error';
          } else if (originalException.statusCode >= 400) {
            errorTitle = 'Request Error';
          }
        } else if (response instanceof Error) {
          // Si no hay originalError pero es una instancia de Error
          errorMessage = response.message || errorMessage;
        } else {
          errorMessage = 'An unexpected error occurred. Please try again.';
        }

        console.error('Auth check error:', errorMessage, errorTitle);
      }
    };
    checkAuth();
  }, []);

  if (status === 'checking') {
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
