import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { useAuthStore } from '../store/useAuthStore';
import { DeleteAccountResponse } from '../interfaces';
import { DeleteAccountRequest } from '../schemas';

export const useDeleteAccountMutation = () => {
  const { deleteAccount } = useAuthStore();

  return useMutation<DeleteAccountResponse, Error, DeleteAccountRequest>({
    mutationFn: async (data: DeleteAccountRequest) => {
      const Response = await deleteAccount(data);
      return Response;
    },
    onSuccess: (response) => {
      if ('statusCode' in response) {
        Toast.show({
          type: 'error',
          text1: 'Account Deletion Failed',
          text2:
            response.message || 'An error occurred while deleting the account.',
        });
        return;
      }

      Toast.show({
        text1: 'Account deleted successfully',
        text2: 'We hope to see you again soon.',
      });
      router.replace('/auth/sign-in');
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Account Deletion Failed',
        text2:
          error.message ||
          'An error occurred while deleting the account. Please try again later.',
      });
    },
  });
};
