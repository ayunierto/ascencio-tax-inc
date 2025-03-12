import React, { useEffect, useState } from 'react';

import { View, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Calendar } from 'react-native-calendars';

import Header from '@/core/auth/components/Header';
import { useBookingStore } from '@/core/services/store/useBookingStore';
import Select from '@/components/ui/Select';
import { theme } from '@/components/ui/theme';
import Loader from '@/components/Loader';
import Alert from '@/components/ui/Alert';
import Chip from '@/components/ui/Chip';
import Button from '@/components/ui/Button';
import { DateTime } from 'luxon';

interface Option {
  label: string;
  value: string;
}

interface Day {
  dateString: string;
  day: number;
  month: number;
  timestamp: number;
  year: number;
}

const BookingScreen = (): JSX.Element => {
  const getCurrentDate = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // month begins from 0 (January is 0)
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [selectedStaff, setSelectedStaff] = useState<Option | null>(null);
  const [availableSlots, setAvailableSlots] = useState<
    {
      start: string;
      end: string;
    }[]
  >([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: string;
    end: string;
  }>();

  const { selectedService } = useBookingStore();

  const staff: Option[] = selectedService!.staff.map(
    ({ name, lastName, id }) => ({
      label: `${name} ${lastName}`,
      value: id,
    })
  );

  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  useEffect(() => {
    if (selectedStaff) {
      const fetchAvailability = async (): Promise<void> => {
        setAvailableSlots([]);

        setLoading(true);
        try {
          const response = await fetch(
            `${API_URL}/availability?staff=${selectedStaff.value}&date=${selectedDate}`
          );
          const data = await response.json();
          console.log({ slots: data });
          setAvailableSlots(data);

          if (data.length === 0) {
            setSelectedSlot(undefined);
          }
        } catch (error) {
          console.error('Error fetching availability:', error);
          setAvailableSlots([]);
          setSelectedSlot(undefined);
        } finally {
          setLoading(false);
        }
      };
      fetchAvailability();
    } else {
      setAvailableSlots([]);
      setSelectedSlot(undefined);
    }
  }, [selectedDate, selectedStaff]);

  const { saveDetails } = useBookingStore();
  function onBookNow(): void {
    if (selectedSlot && selectedStaff) {
      saveDetails(
        selectedStaff.value,
        selectedStaff.label,
        selectedSlot.start,
        selectedSlot.end
      );
      router.push('/booking/resume');
    }
  }

  const handleSelectStaff = (item: Option | null): void => {
    setSelectedSlot(undefined);
    setSelectedStaff(item);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{
            padding: 20,
            gap: 20,
          }}
        >
          <Header
            title="Select your preferences"
            subtitle="Check out our availability and book the date and time that works for
            you."
          />

          <View style={{ flexDirection: 'row' }}>
            <View style={{ gap: 20, width: '50%', flexDirection: 'column' }}>
              <Select
                options={staff}
                onSelect={(item) => handleSelectStaff(item)}
                placeholder="Select staff member..."
              />

              <View
                style={{
                  overflow: 'hidden',
                  borderRadius: theme.radius,
                }}
              >
                <Calendar
                  minDate={getCurrentDate()}
                  theme={{
                    selectedDayBackgroundColor: theme.primary,
                  }}
                  onDayPress={(day: Day) => {
                    console.log({ day });
                    setSelectedDate(day.dateString);
                  }}
                  markedDates={{
                    [selectedDate]: {
                      selected: true,
                      disableTouchEvent: true,
                      selectedDotColor: 'orange',
                    },
                  }}
                />
              </View>
            </View>

            <View style={{ gap: 20, width: '50%' }}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  padding: 8,
                }}
              >
                {loading ? (
                  <Loader />
                ) : !selectedStaff ? (
                  <Alert style={{ width: '100%' }}>
                    Select a staff member to see the schedules available.
                  </Alert>
                ) : availableSlots.length === 0 ? (
                  <Alert>
                    There are no appointments available for this day.
                  </Alert>
                ) : (
                  availableSlots.map((slot) => (
                    <Chip
                      text={DateTime.fromISO(slot.start, {
                        zone: 'America/Toronto',
                      }).toFormat('hh:mm a')}
                      key={slot.start}
                      icon={'alarm-outline'}
                      onPress={() => setSelectedSlot(slot)}
                      style={[
                        selectedSlot?.start === slot.start && {
                          backgroundColor: '#3b82f6',
                        },
                        { margin: 8, width: '40%' },
                      ]}
                      color={
                        selectedSlot?.start === slot.start ? 'white' : 'black'
                      }
                    />
                  ))
                )}
              </View>
              <View>
                {selectedSlot && (
                  <Button onPress={() => onBookNow()}>
                    Schedule an appointment at{' '}
                    {DateTime.fromISO(selectedSlot.start, {
                      zone: 'America/Toronto',
                    }).toFormat('hh:mm a')}
                  </Button>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingScreen;
