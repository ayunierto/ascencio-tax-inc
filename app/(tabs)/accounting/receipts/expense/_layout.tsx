import React, { useCallback } from 'react';
import { Stack } from 'expo-router/stack';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, router, useFocusEffect } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { theme } from '@/components/ui/theme';
import { useQuery } from '@tanstack/react-query';
import { checkSubscription } from '@/core/accounting/subscriptions/actions';
import Loader from '@/components/Loader';

const ExpenseLayout = () => {
  const queryCheckSubscription = useQuery({
    queryKey: ['hasSubscription'],
    queryFn: () => checkSubscription(),
    staleTime: 1000,
  });

  useFocusEffect(
    useCallback(() => {
      queryCheckSubscription.refetch();
    }, [])
  );

  if (queryCheckSubscription.isLoading) {
    return <Loader />;
  }

  if (!queryCheckSubscription.data)
    return <Redirect href={'/accounting/subscriptions'} />;

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,

        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.foreground,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'List of expenses',
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="[id]"
        options={{
          title: 'Expense',
        }}
      />

      <Stack.Screen
        name="create"
        options={{
          title: 'New',

          headerLeft: ({ tintColor }) => {
            return (
              <TouchableOpacity
                onPress={() => router.replace('/accounting/receipts/expense')}
              >
                <Ionicons
                  name="arrow-back-outline"
                  color={tintColor}
                  size={24}
                />
              </TouchableOpacity>
            );
          },
        }}
      />
    </Stack>
  );
};

export default ExpenseLayout;
