import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import {
  ResendResetPasswordCodeRequest,
  ResendResetPasswordCodeResponse,
} from '../interfaces';
import { handleApiErrors } from '../utils';

export const resendResetPasswordCode = async ({
  email,
}: ResendResetPasswordCodeRequest): Promise<ResendResetPasswordCodeResponse> => {
  try {
    const response = await httpClient.post<ResendResetPasswordCodeResponse>(
      'auth/resend-reset-password-code',
      {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );
    return response;
  } catch (error) {
    console.error('Error caught in resendResetPasswordCode:', error);
    return handleApiErrors(error, 'resendResetPasswordCode');
  }
};
