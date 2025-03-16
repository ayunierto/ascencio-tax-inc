import {
  View,
  Text,
  SafeAreaView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { getUserAppointments } from '@/core/appointments/actions/getUserAppointments';
import { useQuery } from '@tanstack/react-query';
import { ScrollView } from 'react-native-gesture-handler';
import { DateTime } from 'luxon';
import { AppointmentResponse } from '@/core/appointments/interfaces/appointmentResponse';
import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';
import { Card, SimpleCardHeader, SimpleCardHeaderTitle } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { SimpleCardHeaderSubTitle } from '@/components/ui/Card/SimpleCardHeaderSubTitle';
import { ThemedText } from '@/components/ui/ThemedText';

const MyBookings = (): JSX.Element => {
  const { data, isPending } = useQuery({
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

  // TODO: Add button to cancel

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            padding: 20,
            gap: 10,
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
    </SafeAreaView>
  );
};

export default MyBookings;
