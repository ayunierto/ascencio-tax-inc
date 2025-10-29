import React from 'react';
import { View, ScrollView } from 'react-native';
import { useBookingStore } from '@/core/services/store/useBookingStore';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, SimpleCardHeader, SimpleCardHeaderTitle } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { CardContent } from '@/components/ui/Card/CardContent';
import { DateTime } from 'luxon';
import { EmptyContent } from '@/core/components';
import { bookAppointment } from '@/core/appointments/actions';
import { AppointmentRequest } from '@/core/appointments/interfaces/appointment-request.interface';
import { Appointment } from '@/core/appointments/interfaces';
import { AxiosError } from 'axios';
import { ServerException } from '@/core/interfaces/server-exception.response';

const ResumeScreen = () => {
  const { service, staff, start, end, timeZone } = useBookingStore();

  if (!service || !staff || !start || !timeZone || !end) {
    return (
      <EmptyContent
        title="Incomplete booking information"
        subtitle="Please go back and complete your booking details."
      />
    );
  }

  const queryClient = useQueryClient();
  const { mutateAsync: mutate, isPending } = useMutation<
    Appointment,
    AxiosError<ServerException>,
    AppointmentRequest
  >({
    mutationFn: bookAppointment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['pendingAppts'] });
    },
    onError: async () => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong. Please try again later.',
      });
    },
  });

  const handleConfirm = async () => {
    await mutate(
      {
        serviceId: service.id,
        staffId: staff.id,
        start,
        end,
        timeZone,
        comments: 'book appointment from mobile app',
      },
      {
        onSuccess() {
          Toast.show({
            type: 'success',
            text1: 'Appointment booked',
            text2: 'Your appointment has been booked successfully',
          });

          router.replace('/(tabs)/my-bookings/bookings');
        },
        onError(error) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.response?.data.message || error.message,
          });
        },
      }
    );
  };

  // TODO: Accept terms and conditions of the appointment where you will explain about your cancellation

  return (
    <ScrollView>
      <View style={{ padding: 20, gap: 20 }}>
        <View style={{ gap: 10 }}>
          <Card>
            <CardContent>
              <SimpleCardHeader>
                <Ionicons
                  name={'receipt-outline'}
                  size={20}
                  color={theme.foreground}
                />
                <SimpleCardHeaderTitle>Service</SimpleCardHeaderTitle>
              </SimpleCardHeader>
              <View>
                <ThemedText style={{ color: theme.muted }}>
                  {service?.name}
                </ThemedText>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SimpleCardHeader>
                <Ionicons
                  name={'map-outline'}
                  size={20}
                  color={theme.foreground}
                />
                <SimpleCardHeaderTitle>Address</SimpleCardHeaderTitle>
              </SimpleCardHeader>
              <View>
                <ThemedText style={{ color: theme.muted }}>
                  {service?.address}
                </ThemedText>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SimpleCardHeader>
                <Ionicons
                  name={'person-outline'}
                  size={20}
                  color={theme.foreground}
                />
                <SimpleCardHeaderTitle>Staff</SimpleCardHeaderTitle>
              </SimpleCardHeader>
              <View>
                <ThemedText style={{ color: theme.muted }}>
                  {staff?.firstName + ' ' + staff?.lastName}
                </ThemedText>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SimpleCardHeader>
                <Ionicons
                  name={'calendar-outline'}
                  size={20}
                  color={theme.foreground}
                />
                <SimpleCardHeaderTitle>Date</SimpleCardHeaderTitle>
              </SimpleCardHeader>
              <View>
                <ThemedText style={{ color: theme.muted }}>
                  {DateTime.fromISO(start).toLocaleString(DateTime.DATE_HUGE)}
                </ThemedText>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SimpleCardHeader>
                <Ionicons
                  name={'time-outline'}
                  size={20}
                  color={theme.foreground}
                />
                <SimpleCardHeaderTitle>Time</SimpleCardHeaderTitle>
              </SimpleCardHeader>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <ThemedText style={{ color: theme.muted }}>
                  {DateTime.fromISO(start).toFormat('h:mm a')}
                </ThemedText>
                <ThemedText style={{ color: theme.muted }}>-</ThemedText>
                <ThemedText style={{ color: theme.muted }}>
                  {DateTime.fromISO(end).toFormat('h:mm a')}
                </ThemedText>
              </View>
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent>
              <SimpleCardHeader>
                <Ionicons name={"chatbubble-outline"} size={20} color={theme.foreground} />
                <SimpleCardHeaderTitle>Comments</SimpleCardHeaderTitle>
              </SimpleCardHeader>
              <View>
                <ThemedText style={{ color: theme.muted }}>{comments ? comments : "No comments"}</ThemedText>
              </View>
            </CardContent>
          </Card> */}
        </View>

        <Button disabled={isPending} onPress={() => handleConfirm()}>
          <ButtonIcon name="checkmark-done-outline" />
          <ButtonText>{isPending ? 'Confirming...' : 'Confirm'}</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
};

export default ResumeScreen;
