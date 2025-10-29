import { useMutation } from '@tanstack/react-query';
import { ResetPasswordResponse } from '../interfaces/reset-password.response';
import { ResetPasswordRequest } from '../schemas/reset-password.schema';
import { resetPasswordAction } from '../actions';
import { AxiosError } from 'axios';
import { ServerException } from '@/core/interfaces/server-exception.response';

export const useResetPasswordMutation = () => {
  return useMutation<
    ResetPasswordResponse,
    AxiosError<ServerException>,
    ResetPasswordRequest
  >({
    mutationFn: async (data: ResetPasswordRequest) => {
      return await resetPasswordAction(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
