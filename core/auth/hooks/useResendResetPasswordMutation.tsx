import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { AxiosError } from "axios";
import { ServerException } from "@/core/interfaces/server-exception.response";
import { ResendResetPasswordCodeResponse } from "../interfaces/resend-reset-password-code.response";

export const useResendResetPasswordMutation = () => {
  return useMutation<
    ResendResetPasswordCodeResponse,
    AxiosError<ServerException>,
    string
  >({
    mutationFn: async (email) => {
      return await resendResetPasswordCode({ email });
    },
    onSuccess: (response) => {
      Toast.show({
        type: "success",
        text1: "Code Resent",
        text2: response.message,
      });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Resend Reset Password Code Error",
        text2: error.message,
      });
    },
  });
};

// TODO: Implement
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resendResetPasswordCode(data: { email: string }): any {
  console.log(data);
  throw new Error("Function not implemented.");
}
