import { useMutation } from '@tanstack/react-query';
import { SignUpRequest, SignUpResponse } from '../interfaces';
import { useAuthStore } from '../store/useAuthStore';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

export const useSignUpMutation = () => {
  const { signUp } = useAuthStore();

  return useMutation<SignUpResponse, Error, SignUpRequest>({
    mutationFn: async (data: SignUpRequest) => {
      const response = await signUp(data);
      return response;
    },
    onSuccess: (response) => {
      if ('user' in response) {
        router.push('/auth/verify-email');
        Toast.show({
          type: 'success',
          text1: 'Sign up successful',
          text2: 'Please verify your email to continue.',
        });
        return;
      }

      Toast.show({
        type: 'error',
        text1: 'Sign up failed',
        text2: response.message || 'An error occurred during sign up.',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Sign up failed',
        text2: error.message || 'An error occurred during sign up.',
      });
    },
  });
};
