import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordResponse } from "../interfaces/forgot-password.response";
import { useAuthStore } from "../store/useAuthStore";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { ForgotPasswordRequest } from "../schemas/forgot-password.schema";
import { AxiosError } from "axios";
import { ServerException } from "@/core/interfaces/server-exception.response";

export const useForgotPasswordMutation = () => {
  const { forgotPassword } = useAuthStore();
  return useMutation<
    ForgotPasswordResponse,
    AxiosError<ServerException>,
    ForgotPasswordRequest
  >({
    mutationFn: async (data: ForgotPasswordRequest) => {
      const response = await forgotPassword(data);
      return response;
    },
    onSuccess: (data) => {
      Toast.show({
        type: "error",
        text1: "Forgot Password Error",
        text2: data.message,
      });
      router.replace("/auth/reset-password");
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Forgot Password Error",
        text2: error.message,
      });
    },
  });
};
