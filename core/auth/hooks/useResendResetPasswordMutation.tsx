import { useMutation } from '@tanstack/react-query';
import { ResendResetPasswordCodeResponse } from '../interfaces';
import Toast from 'react-native-toast-message';
import { authService } from '../services/AuthService';

export const useResendResetPasswordMutation = () => {
  return useMutation<ResendResetPasswordCodeResponse, Error, string>({
    mutationFn: async (email) => {
      return await authService.resendResetPasswordCode({ email });
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
