import { View } from "react-native";
import React, { useEffect } from "react";
import { AvailableSlot } from "../interfaces/available-slot.interface";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ServerException } from "@/core/interfaces/server-exception.response";
import { getAvailabilityAction } from "../actions/get-availability.action";
import { EmptyContent } from "@/core/components/EmptyContent";
import { UseFormReturn } from "react-hook-form";
import { AvailabilityRequest } from "../schemas/availability.schema";
import Alert from "@/components/ui/Alert";
import Loader from "@/components/Loader";
import { convertUtcDateToLocalTime } from "@/utils/convertUtcToLocalTime";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/Button";

interface AvailabilitySlotsProps {
  form: UseFormReturn<AvailabilityRequest>;
  userTimeZone: string;

  onChange?: (slot: AvailableSlot) => void;
}

const AvailabilitySlots = ({ form, userTimeZone, onChange }: AvailabilitySlotsProps) => {
  const [selectedSlot, setSelectedSlot] = React.useState<AvailableSlot>();

  const serviceId = form.watch("serviceId");
  const staffId = form.watch("staffId");
  const date = form.watch("date");

  const {
    isPending,
    isRefetching,
    refetch,
    data,
    isError,
    error: availabilityError,
  } = useQuery<AvailableSlot[], AxiosError<ServerException>>({
    queryKey: ["availability"],
    queryFn: async () => {
      return await getAvailabilityAction({
        serviceId,
        staffId,
        date,
        timeZone: userTimeZone,
      });
    },
  });

  useEffect(() => {
    if (!serviceId || !date) return; // If no service or date is selected, do not fetch availability
    setSelectedSlot(undefined); // Reset selected slot when service or date changes
    form.resetField("time"); // Reset time when service or date changes
    // Refetch availability when serviceId, staffId, or date changes
    refetch();
  }, [serviceId, staffId, date]);

  if (isError) {
    return (
      <EmptyContent
        title="Failed to check availability"
        subtitle={availabilityError.response?.data.message || availabilityError.message}
      />
    );
  }

  if (isPending || isRefetching) {
    return <Loader message="Checking availability..." />;
  }

  if (data && data.length === 0) {
    return (
      <Alert style={{ width: "100%" }} variant="warning">
        There are no appointments available for this day. Please select another day.
      </Alert>
    );
  }

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
      }}
    >
      {data.map((slot) => (
        <Button
          size="sm"
          key={slot.startTimeUTC}
          variant={selectedSlot?.startTimeUTC === slot.startTimeUTC ? "default" : "outline"}
          onPress={() => {
            setSelectedSlot(slot);
            onChange?.(slot);
          }}
          style={{ flex: 1, minWidth: 120, maxWidth: 150 }}
        >
          <ButtonIcon name="time-outline" />
          <ButtonText>{convertUtcDateToLocalTime(slot.startTimeUTC, userTimeZone, "12-hour")}</ButtonText>
        </Button>
      ))}
    </View>
  );
};

export default AvailabilitySlots;
