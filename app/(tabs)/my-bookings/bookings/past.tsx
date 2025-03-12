import { View, Text, Linking, TouchableOpacity } from 'react-native';
import React from 'react';
import { getUserAppointments } from '@/core/appointments/actions/getUserAppointments';
import { useQuery } from '@tanstack/react-query';
import { AppointmentResponse } from '../../../../core/appointments/interfaces/appointmentResponse';
import { ScrollView } from 'react-native-gesture-handler';
import { DateTime } from 'luxon';
import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { SimpleCardHeaderSubTitle } from '@/components/ui/Card/SimpleCardHeaderSubTitle';
import { Card, SimpleCardHeader, SimpleCardHeaderTitle } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';

const PastBookings = (): JSX.Element => {
  const { data, isPending } = useQuery({
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

  return (
    <ScrollView>
      <View
        style={{
          padding: 20,
          gap: 20,
        }}
      >
        {data && data.length > 0 ? (
          data.map((appt: AppointmentResponse) => (
            <TouchableOpacity key={appt.id}>
              <Card>
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
                  <ThemedText>{`Staff: ${appt.staff.name} ${appt.staff.lastName}`}</ThemedText>
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
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                color: theme.foreground,
              }}
            >
              No appointments found
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PastBookings;
