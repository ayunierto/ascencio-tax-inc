import React from "react";

import { View, ScrollView } from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import { useBookingStore } from "@/core/services/store/useBookingStore";
import { useAuthStore } from "@/core/auth/store/useAuthStore";
import Loader from "@/components/Loader";
import { Service } from "@/core/services/interfaces";
import { EmptyContent } from "@/core/components";
import { useServices } from "@/core/services/hooks/useServices";
import { ServiceCard } from "@/components/home/ServiceCard";

const ServicesScreen = () => {
  const { authStatus } = useAuthStore();
  const { setService } = useBookingStore();

  const { data: servicesData, isLoading, isError, error } = useServices();

  const handleServiceSelection = (service: Service): void => {
    setService(service);
    if (authStatus !== "authenticated") {
      router.push("/(tabs)/auth/sign-in");
      Toast.show({
        type: "info",
        text1: "Please, sign in",
        text2: "You must be authenticated to book a service.",
      });
      return;
    }
    router.push("/(tabs)/booking");
    return;
  };

  if (isError)
    return (
      <EmptyContent
        title="Something went wrong."
        subtitle={error.response?.data.message || error.message}
      />
    );

  if (isLoading) return <Loader message="Loading services..." />;

  if (!servicesData || servicesData.services.length === 0) {
    return (
      <EmptyContent
        title="No services available."
        subtitle="Please check back later."
      />
    );
  }

  return (
    <ScrollView>
      <View style={{ padding: 10, flex: 1 }}>
        <View style={{ flexDirection: "column", gap: 10 }}>
          {servicesData.services.map((service: Service) => (
            <ServiceCard
              key={service.id}
              service={service}
              handleServiceSelection={handleServiceSelection}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ServicesScreen;
