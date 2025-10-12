import { useMutation } from "@tanstack/react-query";
import { VerifyCodeResponse } from "../interfaces/verify-code.response";
import { useAuthStore } from "../store/useAuthStore";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { VerifyCodeRequest } from "../schemas/verify-email-code.schema";
import { ServerException } from "@/core/interfaces/server-exception.response";
import { AxiosError } from "axios";

export const useVerifyEmailMutation = () => {
  const { verifyCode } = useAuthStore();

  return useMutation<
    VerifyCodeResponse,
    AxiosError<ServerException>,
    VerifyCodeRequest
  >({
    mutationFn: async (data: VerifyCodeRequest) => {
      const response = await verifyCode(data);
      return response;
    },
    onSuccess: () => {
      router.replace("/auth/sign-in");
      Toast.show({
        type: "success",
        text1: "Verification successful",
        text2: "Please sign in to continue.",
      });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Verification failed",
        text2:
          error.response?.data.message ||
          error.message ||
          "An error occurred during sign up.",
      });
    },
  });
};
