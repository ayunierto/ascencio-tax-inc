import React from 'react';

import { View, Text, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useQuery } from '@tanstack/react-query';

import { getServices } from '@/core/services/actions';
import { ServiceResponse } from '@/core/services/interfaces/services.interface';
import { useBookingStore } from '@/core/services/store/useBookingStore';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';
import Button from '@/components/ui/Button';

const Services = (): JSX.Element => {
  const { selectService } = useBookingStore();
  const { token } = useAuthStore();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
    staleTime: 1000 * 60 * 60, // 1 hora
  });

  if (isPending) {
    return <Loader />;
  }

  const handleSelectService = (service: ServiceResponse): void => {
    selectService(service);
    if (!token) {
      router.push('/settings');
      Toast.show({
        type: 'info',
        text1: 'Info',
        text2: 'You must be authenticated to book a service',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 12 },
      });
      return;
    }
    router.push('/(tabs)/booking');
    return;
  };

  return (
    <ScrollView>
      <View style={{ padding: 20, flex: 1 }}>
        {isError && <Text>{error.message}</Text>}
        <View style={{ flexDirection: 'column', gap: 20 }}>
          {data &&
            data.map((service: ServiceResponse) => (
              <View
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                  // backgroundColor: 'red',
                }}
                key={service.id}
              >
                <Image
                  style={{ width: 60, height: 60, borderRadius: theme.radius }}
                  source={{ uri: service.images[0].url }}
                />

                <View
                  style={{
                    flexDirection: 'column',
                    gap: 2,
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    numberOfLines={2}
                    lineBreakMode="tail"
                    style={{
                      fontSize: 16,
                      color: theme.foreground,
                      width: 200,
                    }}
                  >
                    {service.name}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: theme.muted }}>1 hour</Text>
                    <Ionicons
                      size={18}
                      color={theme.primary}
                      name={
                        service.isAvailableOnline
                          ? 'videocam-outline'
                          : 'videocam-off-outline'
                      }
                    />
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Button
                    onPress={() => handleSelectService(service)}
                    size="small"
                  >
                    Book
                  </Button>
                </View>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Services;
