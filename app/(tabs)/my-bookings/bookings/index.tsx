import {
  View,
  Text,
  SafeAreaView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { getUserAppointments } from '@/core/appointments/actions/get-user-appointments.action';
import { useQuery } from '@tanstack/react-query';
import { ScrollView } from 'react-native-gesture-handler';
import { DateTime } from 'luxon';
import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';
import { Card, SimpleCardHeader, SimpleCardHeaderTitle } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { SimpleCardHeaderSubTitle } from '@/components/ui/Card/SimpleCardHeaderSubTitle';
import { ThemedText } from '@/components/ui/ThemedText';
import { EmptyList } from '@/core/components';
import { Appointment } from '@/core/appointments/interfaces/appointmentResponse';
import { CardContent } from '@/components/ui/Card/CardContent';

const MyBookings = () => {
  const {
    data: pendingAppointments,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['pendingAppts'],
    queryFn: async () => {
      const data = await getUserAppointments('pending');
      return data;
    },
    // staleTime: 1000, // 1 min
  });

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    return <EmptyList title="Error." subtitle={error.message} />;
  }

  if ('error' in pendingAppointments) {
    return <EmptyList title="Error." subtitle={pendingAppointments.message} />;
  }

  if (pendingAppointments && pendingAppointments.length === 0) {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <EmptyList
          title="No appointments found."
          subtitle="Add a new appointment to get started"
        />
      </View>
    );
  }

  // TODO: Add button to cancel appointment

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            padding: 20,
            gap: 10,
          }}
        >
          {pendingAppointments.map((appt: Appointment) => (
            <TouchableOpacity key={appt.id}>
              <Card>
                <CardContent>
                  <SimpleCardHeader>
                    <Ionicons
                      name="calendar-outline"
                      color={theme.foreground}
                      size={24}
                    />
                    <View>
                      <SimpleCardHeaderTitle>
                        {appt.service.name}
                      </SimpleCardHeaderTitle>
                      <SimpleCardHeaderSubTitle>
                        {DateTime.fromISO(appt.startDateAndTime).toLocaleString(
                          {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          }
                        )}
                      </SimpleCardHeaderSubTitle>
                    </View>
                  </SimpleCardHeader>
                  <View>
                    <ThemedText>{`Staff: ${appt.staff.firstName} ${appt.staff.lastName}`}</ThemedText>
                    <ThemedText>
                      Meeting link:{' '}
                      <Text
                        style={{
                          color: theme.primary,
                          textDecorationLine: 'underline',
                        }}
                        onPress={() => Linking.openURL(appt.zoomMeetingLink)}
                      >
                        {appt.zoomMeetingLink}
                      </Text>
                    </ThemedText>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyBookings;
