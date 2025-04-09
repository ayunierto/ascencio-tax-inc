import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { theme } from "@/components/ui/theme";
import { useAuthStore } from "@/core/auth/store/useAuthStore";
import Loader from "@/components/Loader";
import Signin from "../auth/sign-in";

const MyProfileLayout = () => {
  const { status, checkStatus } = useAuthStore();

  // Checking auth status
  useEffect(() => {
    checkStatus();
  }, [status]);

  if (status === "checking") {
    return <Loader />;
  }

  if (status === "unauthenticated") {
    return <Signin />;
    // return <Redirect href={'/auth/sign-in'} />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleAlign: "center",
        headerTintColor: theme.foreground,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "",
        }}
      />

      <Stack.Screen
        name="profile/index"
        options={{
          title: "Account info",
        }}
      />

      <Stack.Screen
        name="profile/delete-account-modal"
        options={{
          presentation: "modal",
          animation: "fade",
          title: "",
        }}
      />
    </Stack>
  );
};

export default MyProfileLayout;
