import { useMutation } from '@tanstack/react-query';
import { VerifyEmailCodeRequest, VerifyEmailCodeResponse } from '../interfaces';
import { useAuthStore } from '../store/useAuthStore';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

export const useVerifyEmailMutation = () => {
  const { verifyEmailCode } = useAuthStore();

  return useMutation<VerifyEmailCodeResponse, Error, VerifyEmailCodeRequest>({
    mutationFn: async (data: VerifyEmailCodeRequest) => {
      const response = await verifyEmailCode(data);
      return response;
    },
    onSuccess: (data) => {
      if ('user' in data) {
        // TODO: Test replace push for replace
        // router.replace('/auth/sign-in');
        router.push('/auth/sign-in');
        Toast.show({
          type: 'success',
          text1: 'Verification successful',
          text2: 'Please sign in to continue.',
        });
        return;
      }

      Toast.show({
        type: 'error',
        text1: 'Verification failed',
        text2: data.message || 'An error occurred during sign up.',
        autoHide: false,
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Verification failed',
        text2: error.message || 'An error occurred during sign up.',
      });
    },
  });
};
