import React from "react";

import { FlatList } from "react-native";
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
  const { updateState } = useBookingStore();

  const { data: servicesData, isPending, isError, error, refetch } = useServices();

  const selectService = (service: Service): void => {
    updateState({ service });
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
    return <EmptyContent title="Something went wrong." subtitle={error.response?.data.message || error.message} />;

  if (isPending) return <Loader message="Loading services..." />;

  if (!servicesData || servicesData.services.length === 0) {
    return <EmptyContent title="No services available." subtitle="Please check back later." onRetry={refetch} />;
  }

  return (
    <FlatList
      data={servicesData.services}
      renderItem={({ item }) => <ServiceCard key={item.id} service={item} selectService={selectService} />}
      contentContainerStyle={{
        padding: 10,
        gap: 10,
      }}
      keyExtractor={(item) => item.id}
    />
  );
};

export default ServicesScreen;
