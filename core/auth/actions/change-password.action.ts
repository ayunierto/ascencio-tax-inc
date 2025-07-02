import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { handleApiErrors } from '../utils';
import { ChangePasswordRequest, ChangePasswordResponse } from '../interfaces';

export const changePassword = async ({
  currentPassword,
  newPassword,
}: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  try {
    const res = await httpClient.post<ChangePasswordResponse>('auth/signin', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return res;
  } catch (error) {
    console.error('Error caught in changePassword:', error);
    return handleApiErrors(error, 'changePassword');
  }
};
