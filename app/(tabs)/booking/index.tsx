import React from "react";

import { View, SafeAreaView, ScrollView } from "react-native";
import { Redirect, router } from "expo-router";

import Header from "@/core/auth/components/Header";
import { useBookingStore } from "@/core/services/store/useBookingStore";
import { useServices } from "@/core/services/hooks/useServices";
import AvailabilityForm from "@/core/booking/components/AvailabilityForm";
import { EmptyContent } from "@/core/components";
import Toast from "react-native-toast-message";

const BookingScreen = () => {
  const { data: serviceData } = useServices();

  const { service } = useBookingStore();
  if (!service) {
    return <Redirect href={"/(tabs)/(home)"} />;
  }

  if (!serviceData) {
    return (
      <EmptyContent title="Services not found" subtitle="An unexpected error has occurred. Please try again later." />
    );
  }

  if (!service.staff || service.staff.length === 0) {
    return (
      <EmptyContent
        title="Staff not found"
        subtitle="An unexpected error has occurred. The service has no assigned staff. Please contact the administrator."
        icon="alert-circle-outline"
      />
    );
  }

  const handleBooking = (): void => {
    Toast.show({
      type: "success",
      text1: "Preferences saved",
      text2: "Please, verify and confirm your appointment.",
    });
    router.push("/booking/resume");
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

          <AvailabilityForm
            services={serviceData?.services}
            selectedService={service}
            serviceStaff={service.staff}
            onSubmit={handleBooking}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingScreen;
