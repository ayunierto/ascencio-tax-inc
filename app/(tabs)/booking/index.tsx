import React, { useEffect, useState } from "react";

import { View, SafeAreaView, ScrollView } from "react-native";
import { Redirect, router } from "expo-router";
import { Calendar } from "react-native-calendars";
import { DateTime } from "luxon";

import Header from "@/core/auth/components/Header";
import { useBookingStore } from "@/core/services/store/useBookingStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/Select";
import { theme } from "@/components/ui/theme";
import Loader from "@/components/Loader";
import Alert from "@/components/ui/Alert";
import Chip from "@/components/ui/Chip";
import { Button, ButtonText } from "@/components/ui/Button";
import { useServices } from "@/core/services/hooks/useServices";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookFormValues, bookSchema } from "@/core/booking/schemas/book.schema";
import { EmptyContent } from "@/core/components";
import { useQuery } from "@tanstack/react-query";
import { getAvailabilityAction } from "@/core/booking/actions/get-availability.action";
import { AxiosError } from "axios";
import { ServerException } from "@/core/interfaces/server-exception.response";

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
    const month = String(date.getMonth() + 1).padStart(2, "0"); // month begins from 0 (January is 0)
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
  if (!selectedService) {
    return <Redirect href={"/(tabs)/(home)"} />;
  }

  if (!selectedService.staff) {
    return (
      <EmptyContent
        title="Staff not found"
        subtitle="No staff member found for this service"
      />
    );
  }

  const staff: Option[] = selectedService.staff.map(
    ({ firstName, lastName, id }) => ({
      label: `${firstName} ${lastName}`,
      value: id,
    })
  );

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      serviceId: selectedService?.id || "",
      staffId: "",
      date: "",
      time: "",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      comments: "",
    },
  });

  const staffId = form.watch("staffId");
  const date = form.watch("date");
  console.log(date);
  console.log(staffId);

  const availability = useQuery<
    AvailabilityResponse[],
    AxiosError<ServerException>
  >({
    queryKey: ["availability"],
    queryFn: async () => {
      return await getAvailabilityAction(staffId, date);
    },
    enabled: !!staffId && !!date,
    retry: 1,
  });

  function onBook(vales: BookFormValues): void {
    console.log(vales);
    // router.push("/booking/resume");
  }

  if (availability.isError) {
    return (
      <EmptyContent
        title="Failed to check availability"
        subtitle={
          availability.error.response?.data.message ||
          availability.error.message
        }
      />
    );
  }
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

          <View>
            <View style={{ gap: 10 }}>
              <Controller
                control={form.control}
                name={"staffId"}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger placeholder={"Select Staff Members"} />
                    <SelectContent>
                      {staff.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          label={opt.label}
                          value={opt.value}
                        />
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <View
                style={{
                  overflow: "hidden",
                  borderRadius: theme.radius,
                }}
              >
                <Calendar
                  minDate={getCurrentDate()}
                  theme={{
                    selectedDayBackgroundColor: theme.primary,
                  }}
                  onDayPress={(day: Day) => {
                    form.setValue("date", day.dateString);
                  }}
                  // markedDates={{
                  //   [selectedDate]: {
                  //     selected: true,
                  //     disableTouchEvent: true,
                  //     selectedDotColor: "orange",
                  //   },
                  // }}
                />
              </View>
            </View>

            <View style={{ gap: 10, marginTop: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  padding: 8,
                }}
              >
                {availability.isLoading ? (
                  <Loader />
                ) : !staffId ? (
                  <Alert style={{ width: "100%" }}>
                    Select a staff member to see the schedules available.
                  </Alert>
                ) : availableSlots.length === 0 ? (
                  <Alert style={{ width: "100%" }}>
                    There are no appointments available for this day. Please
                    select another day.
                  </Alert>
                ) : (
                  availableSlots.map((slot) => (
                    <Chip
                      text={DateTime.fromISO(slot.start, {
                        zone: "America/Toronto",
                      }).toFormat("hh:mm a")}
                      key={slot.start}
                      icon={"alarm-outline"}
                      onPress={() => setSelectedSlot(slot)}
                      style={[
                        selectedSlot?.start === slot.start && {
                          backgroundColor: "#3b82f6",
                        },
                        { margin: 8, width: "40%" },
                      ]}
                      color={
                        selectedSlot?.start === slot.start ? "white" : "black"
                      }
                    />
                  ))
                )}
              </View>
              <View>
                {selectedSlot && (
                  <Button onPress={form.handleSubmit(onBook)}>
                    <ButtonText>
                      {` Schedule an appointment at ${DateTime.fromISO(
                        selectedSlot.start,
                        {
                          zone: "America/Toronto",
                        }
                      ).toFormat("hh:mm a")}`}
                    </ButtonText>
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
