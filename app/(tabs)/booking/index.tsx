import React, { useEffect, useState } from "react";

import { View, SafeAreaView, ScrollView } from "react-native";
import { Redirect, router } from "expo-router";
import { Calendar } from "react-native-calendars";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
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
import {
  BookingFormFields,
  bookingSchema,
} from "@/core/booking/schemas/booking.schema";
import { EmptyContent } from "@/core/components";
import { getAvailabilityAction } from "@/core/booking/actions/get-availability.action";
import { ServerException } from "@/core/interfaces/server-exception.response";
import { AvailabilitySlot } from "@/core/booking/interfaces/availability.response";
import { useServices } from "@/core/services/hooks/useServices";
import { Input } from "@/components/ui/Input";
import { useStaff } from "@/core/staff/hooks/useStaff";
import { convertUtcDateToLocalTime } from "@/utils/convertUtcToLocalTime";

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

const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const BookingScreen = () => {
  const { data: services } = useServices();
  const { data: staff } = useStaff();

  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot>();

  const { service: selectedService, setBookingDetails } = useBookingStore();
  if (!selectedService) {
    return <Redirect href={"/(tabs)/(home)"} />;
  }
  if (!selectedService.staff) {
    return (
      <EmptyContent
        title="Staff not found"
        subtitle="An unexpected error has occurred. The service has no assigned staff. Please contact the administrator."
        icon="alert-circle-outline"
      />
    );
  }

  const serviceStaff: Option[] = selectedService.staff.map(
    ({ firstName, lastName, id }) => ({
      label: `${firstName} ${lastName}`,
      value: id,
    })
  );

  const form = useForm<BookingFormFields>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: selectedService.id,
      start: DateTime.utc().toISO(),
      timeZone: TIME_ZONE,
      comments: "",
      date: DateTime.now().toISO(),
    },
  });

  const serviceId = form.watch("serviceId");
  const staffId = form.watch("staffId");
  const start = form.watch("start");
  const date = form.watch("date");

  const availability = useQuery<
    AvailabilitySlot[],
    AxiosError<ServerException>
  >({
    queryKey: ["availability"],
    queryFn: async () => {
      return await getAvailabilityAction({
        serviceId,
        staffId,
        date,
        timeZone: TIME_ZONE,
      });
    },
  });

  console.log(availability.data);

  useEffect(() => {
    if (!serviceId || !date) return;
    availability.refetch();
  }, [serviceId, staffId, date]);

  function handleBooking(values: BookingFormFields): void {
    const selectedService = services?.services.find(
      (service) => service.id === values.serviceId
    );
    if (!staff) return;
    const selectedStaff = staff.find((staff) => staff.id === values.staffId);
    if (!selectedService || !selectedStaff) return;

    setBookingDetails(
      selectedService,
      selectedStaff,
      "",
      "",
      values.timeZone,
      values.comments
    );
    setSelectedSlot(undefined);
    form.reset();

    router.push("/booking/resume");
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
                name={"serviceId"}
                render={({ field: { onChange, value } }) => (
                  <Select
                    placeholder={value}
                    value={value}
                    onValueChange={onChange}
                    error={!!form.formState.errors.serviceId}
                    errorMessage={form.formState.errors.serviceId?.message}
                  >
                    <SelectTrigger placeholder={"Select a service"} />
                    <SelectContent>
                      {services?.services.map((service) => (
                        <SelectItem
                          key={service.id}
                          label={service.name}
                          value={service.id}
                        />
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                control={form.control}
                name={"staffId"}
                render={({ field: { onChange, value } }) => (
                  <Select
                    value={value}
                    onValueChange={onChange}
                    error={!!form.formState.errors.staffId}
                    errorMessage={form.formState.errors.staffId?.message}
                  >
                    <SelectTrigger placeholder={"Select Staff Members"} />
                    <SelectContent>
                      {serviceStaff.map((opt) => (
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
                <Controller
                  control={form.control}
                  name={"date"}
                  render={({ field: { value, onChange } }) => (
                    <Calendar
                      minDate={DateTime.now().toFormat("yyyy-MM-dd")}
                      theme={{
                        selectedDayBackgroundColor: theme.primary,
                      }}
                      onDayPress={(day: Day) => {
                        const userDate = DateTime.fromISO(day.dateString);
                        onChange(
                          userDate
                            .set({
                              hour: DateTime.now().hour,
                              minute: DateTime.now().minute,
                              second: DateTime.now().second,
                              millisecond: DateTime.now().millisecond,
                            })
                            .toISO()
                        );
                        setSelectedSlot(undefined);
                      }}
                      markedDates={{
                        [DateTime.fromISO(value)
                          .setZone(TIME_ZONE)
                          .toFormat("yyyy-MM-dd")]: {
                          selected: true,
                          disableTouchEvent: true,
                          selectedDotColor: "orange",
                        },
                      }}
                    />
                  )}
                />
              </View>
            </View>

            <View style={{ marginVertical: 20 }}>
              {availability.isFetching ? (
                <Loader message="Checking availability..." />
              ) : !staffId || !start || !date || !serviceId ? (
                <Alert style={{ width: "100%" }}>
                  Select a staff member and date to see the schedules available.
                </Alert>
              ) : (availability.data && availability.data.length === 0) ||
                !availability.data ? (
                <Alert style={{ width: "100%" }}>
                  There are no appointments available for this day. Please
                  select another day.
                </Alert>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  {availability.data.map((slot) => (
                    <Chip
                      text={convertUtcDateToLocalTime(
                        slot.start,
                        TIME_ZONE,
                        "12-hour"
                      )}
                      key={slot.start}
                      icon={"alarm-outline"}
                      onPress={() => {
                        setSelectedSlot(slot);
                        form.setValue("time", slot.start);
                        form.setValue("start", slot.start);
                      }}
                      style={[
                        {
                          backgroundColor: theme.foreground,
                        },
                        selectedSlot?.start === slot.start && {
                          backgroundColor: "#3b82f6",
                        },
                        { width: "45%" },
                      ]}
                      color={
                        selectedSlot?.start === slot.start ? "white" : "black"
                      }
                    />
                  ))}
                </View>
              )}

              {/* Errors */}
              {!!form.formState.errors.time && (
                <Alert style={{ width: "100%" }}>
                  {form.formState.errors.time.message}
                </Alert>
              )}
              {!!form.formState.errors.start && (
                <Alert style={{ width: "100%" }}>
                  {form.formState.errors.start.message}
                </Alert>
              )}
              {!!form.formState.errors.timeZone && (
                <Alert style={{ width: "100%" }}>
                  {form.formState.errors.timeZone.message}
                </Alert>
              )}
            </View>

            <View style={{ gap: 10 }}>
              <Controller
                control={form.control}
                name={"comments"}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder="Comments"
                    leadingIcon="chatbubble-outline"
                    error={!!form.formState.errors.comments}
                    errorMessage={form.formState.errors.comments?.message}
                  />
                )}
              />

              <Button onPress={form.handleSubmit(handleBooking)}>
                <ButtonText>Schedule an appointment</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingScreen;
