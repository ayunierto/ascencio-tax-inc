import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { VerifyEmailCodeRequest, VerifyEmailCodeResponse } from '../interfaces';
import { handleApiErrors } from '../utils';

export const verifyEmailCode = async ({
  code,
  email,
}: VerifyEmailCodeRequest): Promise<VerifyEmailCodeResponse> => {
  try {
    const res = await httpClient.post<VerifyEmailCodeResponse>(
      'auth/verify-email-code',
      {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, email }),
      }
    );
    return res;
  } catch (error) {
    console.error('Error caught in verifyEmailCode:', error);
    return handleApiErrors(error, 'verifyEmailCode');
  }
};
