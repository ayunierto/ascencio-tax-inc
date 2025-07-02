import { useMutation } from '@tanstack/react-query';
import { ForgotPasswordRequest, ForgotPasswordResponse } from '../interfaces';
import { useAuthStore } from '../store/useAuthStore';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

export const useForgotPasswordMutation = () => {
  const { forgotPassword } = useAuthStore();
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
    mutationFn: async (data: ForgotPasswordRequest) => {
      const response = await forgotPassword(data);
      return response;
    },
    onSuccess: (data) => {
      if ('error' in data) {
        Toast.show({
          type: 'error',
          text1: 'Forgot Password Error',
          text2: data.message,
        });
        return;
      }
      Toast.show({
        type: 'success',
        text1: 'Code Sent',
        text2: data.message,
      });
      router.replace('/auth/reset-password');
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Forgot Password Error',
        text2: error.message,
      });
    },
  });
};
