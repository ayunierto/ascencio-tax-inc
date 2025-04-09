import React from "react";
import { View, ScrollView } from "react-native";
import { useBookingStore } from "@/core/services/store/useBookingStore";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, SimpleCardHeader, SimpleCardHeaderTitle } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/components/ui/theme";
import { ThemedText } from "@/components/ui/ThemedText";
import Button from "@/components/ui/Button";
import { DateTime } from "luxon";
import { CardContent } from "@/components/ui/Card/CardContent";

const ResumeScreen = () => {
  const { selectedService, staffName, startDateAndTime, bookNow } =
    useBookingStore();

  const queryClient = useQueryClient();
  const { mutateAsync: mutate, isPending } = useMutation({
    mutationFn: async () => {
      const data = await bookNow();
      console.log({ data });
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pendingAppts"] });
    },
  });

  const handleConfirm = async () => {
    await mutate()
      .then((data) => {
        if (data.id) {
          Toast.show({
            type: "success",
            text1: "Appointment booked",
            text2: "Your appointment has been booked successfully",
            text1Style: { fontSize: 14 },
            text2Style: { fontSize: 12 },
          });
          router.replace("/(tabs)/my-bookings/bookings");
        } else {
          Toast.show({
            type: "error",
            text1: "Something went wrong",
            text2: `${data.message}`,
            text1Style: { fontSize: 14 },
            text2Style: { fontSize: 12 },
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
                  name={"receipt-outline"}
                  size={20}
                  color={theme.foreground}
                />
                <SimpleCardHeaderTitle>Service</SimpleCardHeaderTitle>
              </SimpleCardHeader>
              <View>
                <ThemedText>{selectedService?.name}</ThemedText>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SimpleCardHeader>
                <Ionicons
                  name={"map-outline"}
                  size={20}
                  color={theme.foreground}
                />
                <SimpleCardHeaderTitle>Address</SimpleCardHeaderTitle>
              </SimpleCardHeader>
              <View>
                <ThemedText>{selectedService?.address}</ThemedText>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SimpleCardHeader>
                <Ionicons
                  name={"person-outline"}
                  size={20}
                  color={theme.foreground}
                />
                <SimpleCardHeaderTitle>Staff</SimpleCardHeaderTitle>
              </SimpleCardHeader>
              <View>
                <ThemedText>{staffName}</ThemedText>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SimpleCardHeader>
                <Ionicons
                  name={"calendar-outline"}
                  size={20}
                  color={theme.foreground}
                />
                <SimpleCardHeaderTitle>Date</SimpleCardHeaderTitle>
              </SimpleCardHeader>
              <View>
                <ThemedText>
                  {DateTime.fromISO(startDateAndTime!, {
                    zone: "America/Toronto",
                  })
                    .toJSDate()
                    .toDateString()}
                </ThemedText>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SimpleCardHeader>
                <Ionicons
                  name={"time-outline"}
                  size={20}
                  color={theme.foreground}
                />
                <SimpleCardHeaderTitle>Time</SimpleCardHeaderTitle>
              </SimpleCardHeader>
              <View>
                <ThemedText>
                  {DateTime.fromISO(startDateAndTime!, {
                    zone: "America/Toronto",
                  }).toFormat("hh:mm a")}
                </ThemedText>
              </View>
            </CardContent>
          </Card>
        </View>

        <Button
          loading={isPending}
          disabled={isPending}
          onPress={() => handleConfirm()}
        >
          Confirm Appointment
        </Button>
      </View>
    </ScrollView>
  );
};

export default ResumeScreen;
