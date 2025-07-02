import { useMutation } from '@tanstack/react-query';
import {
  ResendResetPasswordCodeRequest,
  ResendResetPasswordCodeResponse,
} from '../interfaces';
import { resendResetPasswordCode } from '../actions';
import Toast from 'react-native-toast-message';

export const useResendResetPasswordMutation = () => {
  return useMutation<
    ResendResetPasswordCodeResponse,
    Error,
    ResendResetPasswordCodeRequest
  >({
    mutationFn: async (data: ResendResetPasswordCodeRequest) => {
      return await resendResetPasswordCode(data);
    },
    onSuccess: (response) => {
      if ('error' in response) {
        Toast.show({
          type: 'error',
          text1: 'Resend Reset Password Code Error',
          text2: response.message,
        });
        return;
      }
      Toast.show({
        type: 'success',
        text1: 'Code Resent',
        text2: response.message,
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Resend Reset Password Code Error',
        text2: error.message,
      });
    },
  });
};
