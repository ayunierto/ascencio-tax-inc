import { useMutation } from '@tanstack/react-query';
import { ResetPasswordRequest, ResetPasswordResponse } from '../interfaces';
import { resetPassword } from '../actions';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

export const useResetPasswordMutation = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
    mutationFn: async (data: ResetPasswordRequest) => {
      return await resetPassword(data);
    },
    onSuccess: (response) => {
      if ('error' in response) {
        Toast.show({
          type: 'error',
          text1: 'Reset Password Error',
          text2: response.message,
        });
        return;
      }
      Toast.show({
        type: 'success',
        text1: 'Password Reset Successfully',
        text2: response.message,
      });
      router.replace('/auth/sign-in');
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Reset Password Error',
        text2: error.message,
      });
    },
  });
};
