import { useMutation } from '@tanstack/react-query';

import Toast from 'react-native-toast-message';
import { ResendEmailCodeResponse } from '../interfaces';
import { authService } from '../services/AuthService';

export const useResendEmailCodeMutation = () => {
  return useMutation<ResendEmailCodeResponse, Error, string>({
    mutationFn: async (email: string) => {
      return await authService.resendEmailCode({ email });
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
