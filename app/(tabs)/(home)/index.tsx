import React from "react";

import { View, Text, Image, ScrollView } from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import { useBookingStore } from "@/core/services/store/useBookingStore";
import { useAuthStore } from "@/core/auth/store/useAuthStore";
import Loader from "@/components/Loader";
import { Service } from "@/core/services/interfaces";
import { EmptyContent } from "@/core/components";
import { LoadingError } from "@/components/LoadingError";
import { useServices } from "@/core/services/hooks/useServices";
import { ServiceCard } from "@/components/home/ServiceCard";

const Services = () => {
  const { authStatus } = useAuthStore();
  const { selectService } = useBookingStore();

  const { data: servicesData, isLoading, isError, error } = useServices();

  const handleServiceSelection = (service: Service): void => {
    selectService(service);
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
      <LoadingError
        name="services"
        message={
          error.response?.data.message || error.message || "Unknown error"
        }
      />
    );
  if (isLoading) return <Loader message="Loading services..." />;

  if (!servicesData || servicesData.services.length === 0)
    return (
      <EmptyContent
        title="No services available."
        subtitle="Please check back later."
      />
    );

  return (
    <ScrollView>
      <View style={{ padding: 10, flex: 1 }}>
        <View style={{ flexDirection: "column", gap: 20 }}>
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

export default Services;
