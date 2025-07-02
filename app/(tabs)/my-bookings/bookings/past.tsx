import { View, Text, Linking, TouchableOpacity } from 'react-native';
import React from 'react';
import { getUserAppointments } from '@/core/appointments/actions/get-user-appointments.action';
import { useQuery } from '@tanstack/react-query';
import { ScrollView } from 'react-native-gesture-handler';
import { DateTime } from 'luxon';
import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { SimpleCardHeaderSubTitle } from '@/components/ui/Card/SimpleCardHeaderSubTitle';
import { Card, SimpleCardHeader, SimpleCardHeaderTitle } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { EmptyList } from '@/core/components';
import { Appointment } from '@/core/appointments/interfaces/appointmentResponse';
import { CardContent } from '@/components/ui/Card/CardContent';

const PastBookings = (): JSX.Element => {
  const {
    data: historicalBookings,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['PastAppts'],
    queryFn: async () => {
      const data = await getUserAppointments('past');
      return data;
    },
    staleTime: 1000 * 60, // 1 min
  });

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    return <EmptyList title="Error." subtitle={error.message} />;
  }

  if ('error' in historicalBookings) {
    return <EmptyList title="Error." subtitle={historicalBookings.message} />;
  }

  if (historicalBookings && historicalBookings.length === 0) {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <EmptyList
          title="No appointments found."
          subtitle="Has no previous appointments."
        />
      </View>
    );
  }

  return (
    <ScrollView>
      <View
        style={{
          padding: 20,
          gap: 20,
        }}
      >
        {historicalBookings.map((appt: Appointment) => (
          <TouchableOpacity key={appt.id}>
            <Card>
              <CardContent>
                <SimpleCardHeader>
                  <Ionicons
                    name={'calendar-outline'}
                    color={theme.foreground}
                    size={24}
                  />
                  <View>
                    <SimpleCardHeaderTitle>
                      {appt.service.name}
                    </SimpleCardHeaderTitle>
                    <SimpleCardHeaderSubTitle>
                      {DateTime.fromISO(appt.startDateAndTime).toLocaleString({
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
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
  );
};

export default PastBookings;
