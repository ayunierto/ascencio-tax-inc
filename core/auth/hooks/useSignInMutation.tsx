import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '../store/useAuthStore';
import { SignInResponse } from '../interfaces';
import { SignInRequest } from '../schemas';
import { authService } from '../services/AuthService';

export const useSignInMutation = () => {
  const { signIn } = useAuthStore();

  return useMutation<SignInResponse, Error, SignInRequest>({
    mutationFn: async (values: SignInRequest) => {
      const response = await signIn(values);
      return response;
    },
    onSuccess: (response, variables) => {
      console.warn('SignInResponse:', response);

      if ('access_token' in response) {
        router.push('/(tabs)/(home)');
        Toast.show({
          type: 'success',
          text1: 'Sign in successful',
          text2: 'Welcome back!',
        });
        return;
      }

      Toast.show({
        type: 'error',
        text1: 'Sign in failed',
        text2: response.message || 'An unexpected error occurred.',
      });

      // If the response indicates that the email is not verified,
      // redirect to the verification page
      if (response.error === 'EmailNotVerified') {
        authService.resendEmailCode({ email: variables.email });
        router.replace('/auth/verify-email');
        Toast.show({
          type: 'info',
          text1: 'Email not verified',
          text2: 'Please verify your email to continue.',
        });
      }
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Sign in failed',
        text2: error.message || 'An unexpected error occurred.',
      });
    },
  });
};
