import { useMutation } from '@tanstack/react-query';

import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { UpdateProfileResponse } from '@/core/auth/interfaces';
import { UpdateProfileRequest } from '@/core/auth/schemas';

export const useUpdateProfileMutation = () => {
  const { updateProfile } = useAuthStore();

  return useMutation<UpdateProfileResponse, Error, UpdateProfileRequest>({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await updateProfile(data);
      console.log(response);
      return response;
    },
    onSuccess: (response) => {
      if ('statusCode' in response) {
        Toast.show({
          type: 'error',
          text1: 'Profile update failed',
          text2: response.message,
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Profile update failed',
        text2: error.message || 'An error occurred while updating the profile.',
      });
    },
  });
};
