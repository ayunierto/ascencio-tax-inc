import { ScrollView, View } from 'react-native';
import React from 'react';
import { Card, SimpleCardHeader, SimpleCardHeaderTitle } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { getSubscriptions } from '@/core/accounting/subscriptions/actions/get-subscriptions.action';
import Loader from '@/components/Loader';
import { ThemedText } from '@/components/ui/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/components/ui/theme';
import { SimpleCardHeaderSubTitle } from '@/components/ui/Card/SimpleCardHeaderSubTitle';
import { DateTime } from 'luxon';

const MySubscriptions = () => {
  const subscriptionQuery = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => getSubscriptions(),
  });

  if (subscriptionQuery.isLoading) return <Loader />;

  if (!subscriptionQuery.data) return;
  // if ('statusCode' in subscriptionQuery.data) return;

  const { data: subscriptions } = subscriptionQuery;

  if ('statusCode' in subscriptions)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>{subscriptions.message}</ThemedText>
      </View>
    );

  return (
    <ScrollView>
      {subscriptions.map((sub) => (
        <Card key={sub.id} style={{ flex: 1, marginHorizontal: 20 }}>
          <SimpleCardHeader>
            <Ionicons name="cafe-outline" size={30} color={theme.foreground} />
            <View style={{ flex: 1 }}>
              <SimpleCardHeaderTitle style={{ fontSize: 24 }}>
                {sub.plan.name} Plan
              </SimpleCardHeaderTitle>
              <SimpleCardHeaderSubTitle style={{ fontSize: 14 }}>
                {sub.plan.description}
              </SimpleCardHeaderSubTitle>
            </View>
          </SimpleCardHeader>
          <View style={{ paddingVertical: 10, gap: 5 }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <ThemedText>Status:</ThemedText>
              <ThemedText style={{ fontWeight: 'bold' }}>
                {sub.status.toLocaleUpperCase()}
              </ThemedText>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <ThemedText>Subscription:</ThemedText>
              <ThemedText style={{ fontWeight: 'bold' }}>
                {DateTime.fromISO(sub.startDate).toLocaleString({
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </ThemedText>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <ThemedText>Expires in:</ThemedText>
              <ThemedText style={{ fontWeight: 'bold' }}>
                {DateTime.fromISO(sub.endDate)
                  .diff(DateTime.now(), 'days')
                  .days.toFixed(0)}{' '}
                days
              </ThemedText>
            </View>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
};

export default MySubscriptions;
