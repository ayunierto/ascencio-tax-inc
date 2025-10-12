import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useAuthStore } from "../store/useAuthStore";
import { SignInRequest } from "../schemas/sign-in.schema";
import { AuthResponse } from "../interfaces";
import { ServerException } from "@/core/interfaces/server-exception.response";
import { resendCode } from "../actions/resend-code.action";

export const useSignInMutation = () => {
  const { signIn } = useAuthStore();

  return useMutation<AuthResponse, AxiosError<ServerException>, SignInRequest>({
    mutationFn: async (values: SignInRequest) => {
      const response = await signIn(values);
      return response;
    },
    onSuccess: () => {
      router.push("/(tabs)/(home)");
      Toast.show({
        type: "success",
        text1: "Sign in successful",
        text2: "Welcome back!",
      });
    },
    onError: (error, variables) => {
      // If the response indicates that the email is not verified,
      // redirect to the verification page
      if (error.response?.data.error === "Email Not Verified") {
        resendCode(variables.email);
        router.replace("/auth/verify-email");
        Toast.show({
          type: "info",
          text1: "Email not verified",
          text2: "Please verify your email to continue.",
        });
        return;
      }
      Toast.show({
        type: "error",
        text1: "Sign in failed",
        text2:
          error.response?.data.message ||
          error.message ||
          "An unexpected error occurred.",
      });
    },
  });
};
