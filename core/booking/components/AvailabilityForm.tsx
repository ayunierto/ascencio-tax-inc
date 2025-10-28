import React from "react";

import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";

import { AvailabilityRequest, availabilitySchema } from "../schemas/availability.schema";
import { Service } from "@/core/services/interfaces";
import { Staff } from "@/core/staff/interfaces";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/Select";
import { theme } from "@/components/ui/theme";
import { CalendarDay } from "../interfaces/calendar-day.interface";
import AvailabilitySlots from "./AvailabilitySlots";
import Alert from "@/components/ui/Alert";
import { useBookingStore } from "@/core/services/store/useBookingStore";

interface AvailabilityFormProps {
  services: Service[];
  selectedService: Service;
  serviceStaff: Staff[];

  onSubmit: (values: AvailabilityRequest) => void;
}

const AvailabilityForm = ({ services, selectedService, serviceStaff, onSubmit }: AvailabilityFormProps) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { updateState } = useBookingStore();
  const form = useForm<AvailabilityRequest>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      serviceId: selectedService.id,
      date: DateTime.now().toISO(), // Initialize with current date
      timeZone: userTimeZone,
    },
  });

  return (
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
            <SelectTrigger placeholder={"Select a service"} labelText="Service" />
            <SelectContent>
              {services.map(({ id, name }) => (
                <SelectItem key={id} label={name} value={id} />
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
            <SelectTrigger placeholder={"Select Staff"} labelText="Staff" />
            <SelectContent>
              {serviceStaff.map(({ id, firstName, lastName }) => (
                <SelectItem key={id} label={`${firstName} ${lastName}`} value={id} />
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <View style={styles.calendarContainer}>
        <Controller
          control={form.control}
          name={"date"}
          render={({ field: { value, onChange } }) => (
            <Calendar
              minDate={DateTime.now().toFormat("yyyy-MM-dd")}
              theme={{
                selectedDayBackgroundColor: theme.primary,
              }}
              onDayPress={(day: CalendarDay) => {
                const userDate = DateTime.fromISO(day.dateString)
                  .setZone(userTimeZone)
                  .set({
                    hour: DateTime.now().hour,
                    minute: DateTime.now().minute,
                  })
                  .toISO();

                onChange(userDate);
              }}
              markedDates={{
                [DateTime.fromISO(value).setZone(userTimeZone).toFormat("yyyy-MM-dd")]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedDotColor: "orange",
                },
              }}
            />
          )}
        />
      </View>

      <Controller
        control={form.control}
        name={"time"}
        render={({ field: { onChange } }) => (
          <AvailabilitySlots
            form={form}
            userTimeZone={userTimeZone}
            onChange={(slot) => {
              onChange(slot.startTimeUTC);
              // Update the booking store with selected slot details
              updateState({
                start: slot.startTimeUTC,
                end: slot.endTimeUTC,
                timeZone: userTimeZone,
                staff: slot.availableStaff[Math.floor(Math.random() * slot.availableStaff.length)], // Select a random staff from the available ones
              });
            }}
          />
        )}
      />

      {/* Handle error messages */}
      {form.formState.errors.date && (
        <Alert style={{ width: "100%" }} variant="error">
          {form.formState.errors.date.message}
        </Alert>
      )}

      {form.formState.errors.time && (
        <Alert style={{ width: "100%" }} variant="error">
          {form.formState.errors.time.message}
        </Alert>
      )}

      {form.formState.errors.timeZone && (
        <Alert style={{ width: "100%" }} variant="error">
          {form.formState.errors.timeZone.message}
        </Alert>
      )}

      <Button onPress={form.handleSubmit(onSubmit)}>
        <ButtonIcon name="calendar-outline" />
        <ButtonText>Book Appointment</ButtonText>
      </Button>
    </View>
  );
};

export default AvailabilityForm;

const styles = StyleSheet.create({
  calendarContainer: {
    overflow: "hidden",
    borderRadius: theme.radius,
  },
  slot: {
    backgroundColor: theme.foreground,
  },
});
