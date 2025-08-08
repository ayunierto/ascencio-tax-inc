import React from 'react';

import { View, Text, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useQuery } from '@tanstack/react-query';

import { getServices } from '@/core/services/actions';
import { useBookingStore } from '@/core/services/store/useBookingStore';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';
import Button from '@/components/ui/Button';
import { Service } from '@/core/services/interfaces';
import { EmptyList } from '@/core/components';
import {
  HttpError,
  NetworkError,
} from '@/core/adapters/http/http-client.interface';
import { LoadingError } from '@/components/LoadingError';

const Services = () => {
  const { access_token } = useAuthStore();
  const { selectService } = useBookingStore();

  const {
    data: services,
    isFetching,
    isError,
    error,
  } = useQuery<Service[] | HttpError, Error>({
    queryKey: ['services'],
    queryFn: getServices,
    staleTime: 1000 * 60 * 10, // 10 min
  });

  const handleServiceSelection = (service: Service): void => {
    selectService(service);
    if (!access_token) {
      router.push('/(tabs)/auth/sign-in');
      Toast.show({
        type: 'info',
        text1: 'Please, sign in',
        text2: 'You must be authenticated to book a service.',
      });
      return;
    }
    router.push('/(tabs)/booking');
    return;
  };

  if (isFetching) return <Loader />;
  if (!services) return <LoadingError name="services" />;
  if (services instanceof HttpError) {
    return <EmptyList title="Error" subtitle={services.message} />;
  }
  if (services instanceof NetworkError) {
    return <EmptyList title="Error" subtitle={services.message} />;
  }
  if (services.length === 0) {
    return <EmptyList title="No services found." />;
  }

  return (
    <ScrollView>
      <View style={{ padding: 20, flex: 1 }}>
        {isError && <Text>{error.message}</Text>}
        <View style={{ flexDirection: 'column', gap: 20 }}>
          {services.map((service: Service) => (
            <View
              style={{
                flex: 1,
                overflow: 'hidden',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
              }}
              key={service.id}
            >
              <Image
                style={{ width: 60, height: 60, borderRadius: theme.radius }}
                source={{ uri: service.image }}
              />

              <View
                style={{
                  flexDirection: 'column',
                  gap: 2,
                  justifyContent: 'center',
                  flex: 1,
                }}
              >
                <Text
                  // numberOfLines={2}
                  // lineBreakMode="tail"
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

              <Button
                style={{ maxWidth: 100 }}
                onPress={() => handleServiceSelection(service)}
                size="small"
              >
                Book
              </Button>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Services;
