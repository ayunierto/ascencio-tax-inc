import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useAuthStore } from '../store/useAuthStore';
import { SignInRequest } from '../schemas/sign-in.schema';
import { AuthResponse } from '../interfaces';
import { ServerException } from '@/core/interfaces/server-exception.response';

export const useSignInMutation = () => {
  const { signIn } = useAuthStore();

  return useMutation<AuthResponse, AxiosError<ServerException>, SignInRequest>({
    mutationFn: signIn,
    onError: (error) => {
      console.error(error);
    },
  });
};
