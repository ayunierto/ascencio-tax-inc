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
import { Button, ButtonText } from "@/components/ui/Button";
import { CardContent } from "@/components/ui/Card/CardContent";
import { DateTime } from "luxon";

const ResumeScreen = () => {
  const { service, staff, bookNow, utcDateTime, comments } = useBookingStore();

  const queryClient = useQueryClient();
  const { mutateAsync: mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await bookNow();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pendingAppts"] });
      Toast.show({
        type: "success",
        text1: "Appointment booked",
        text2: "Your appointment has been booked successfully",
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 12 },
      });

      router.replace("/(tabs)/my-bookings/bookings");
    },
    onError: async () => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong",
      });
    },
  });

  const handleConfirm = async () => {
    await mutate();
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
                <ThemedText style={{ color: theme.muted }}>
                  {service?.name}
                </ThemedText>
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
                <ThemedText style={{ color: theme.muted }}>
                  {service?.address}
                </ThemedText>
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
                <ThemedText style={{ color: theme.muted }}>
                  {staff?.firstName + " " + staff?.lastName}
                </ThemedText>
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
                <ThemedText style={{ color: theme.muted }}>
                  {DateTime.fromISO(utcDateTime!).toFormat("yyyy LLL dd")}
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
                <ThemedText style={{ color: theme.muted }}>
                  {DateTime.fromISO(utcDateTime!).toFormat("h:mm a")}
                </ThemedText>
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <SimpleCardHeader>
                <Ionicons
                  name={"chatbubble-outline"}
                  size={20}
                  color={theme.foreground}
                />
                <SimpleCardHeaderTitle>Comments</SimpleCardHeaderTitle>
              </SimpleCardHeader>
              <View>
                <ThemedText style={{ color: theme.muted }}>
                  {comments ? comments : "No comments"}
                </ThemedText>
              </View>
            </CardContent>
          </Card>
        </View>

        <Button disabled={isPending} onPress={() => handleConfirm()}>
          <ButtonText>Confirm</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
};

export default ResumeScreen;
