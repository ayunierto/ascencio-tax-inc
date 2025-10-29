import { useMutation } from '@tanstack/react-query';
import { ForgotPasswordResponse } from '../interfaces/forgot-password.response';
import { useAuthStore } from '../store/useAuthStore';
import { ForgotPasswordRequest } from '../schemas/forgot-password.schema';
import { AxiosError } from 'axios';
import { ServerException } from '@/core/interfaces/server-exception.response';

export const useForgotPasswordMutation = () => {
  const { forgotPassword } = useAuthStore();

  return useMutation<
    ForgotPasswordResponse,
    AxiosError<ServerException>,
    ForgotPasswordRequest
  >({
    mutationFn: async (data: ForgotPasswordRequest) => {
      return await forgotPassword(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
