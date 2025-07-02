import { useMutation } from '@tanstack/react-query';
import {
  ResendEmailVerificationCodeRequest,
  ResendEmailVerificationResponse,
} from '../interfaces';
import { resendEmailCode } from '../actions';
import Toast from 'react-native-toast-message';

export const useResendEmailCodeMutation = () => {
  return useMutation<
    ResendEmailVerificationResponse,
    Error,
    ResendEmailVerificationCodeRequest
  >({
    mutationFn: async (data: ResendEmailVerificationCodeRequest) => {
      return await resendEmailCode(data);
    },
    onSuccess: (response) => {
      if ('error' in response) {
        Toast.show({
          type: 'error',
          text1: 'Resend Email Code Error',
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
        text1: 'Resend Email Code Error',
        text2: error.message,
      });
    },
  });
};
