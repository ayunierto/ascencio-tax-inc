import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { GetPlans } from '@/core/accounting/plans/actions/get-plans.action';
import SubscriptionCard from '@/core/accounting/subscriptions/components/SubscriptionCard';
import Loader from '@/components/Loader';
import { ThemedText } from '@/components/ui/ThemedText';
import { theme } from '@/components/ui/theme';
import { router, useFocusEffect } from 'expo-router';
import { checkSubscription } from '@/core/accounting/subscriptions/actions';

const SubscriptionsScreen = () => {
  const queryCheckSubscription = useQuery({
    queryKey: ['hasSubscription'],
    queryFn: () => checkSubscription(),
    staleTime: 1000,
  });

  useFocusEffect(
    useCallback(() => {
      queryCheckSubscription.refetch();
      if (queryCheckSubscription.data) {
        console.info('It has plan');
        router.navigate('/accounting/subscriptions/my-subscription');
      }
    }, [queryCheckSubscription.data])
  );

  const plansQuery = useQuery({
    queryKey: ['plans'],
    queryFn: async () => GetPlans(),
  });

  if (plansQuery.isLoading) return <Loader />;

  if (!plansQuery.data) return <ThemedText>Something went wrong</ThemedText>;

  const { data: plans } = plansQuery;

  return (
    <View style={{ flex: 1, marginVertical: 20, gap: 20 }}>
      <View style={{ marginHorizontal: 20 }}>
        <ThemedText style={styles.title}>
          Choose the perfect plan for you
        </ThemedText>
        <ThemedText style={styles.description}>
          Choose the plan that best fits your needs and enjoy all the benefits
          of our platform.
        </ThemedText>
      </View>

      <FlatList
        data={plans}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => <SubscriptionCard plan={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: { color: theme.muted, textAlign: 'left' },
});

export default SubscriptionsScreen;
