import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { handleApiErrors } from '../utils';
import { SignInRequest, SignInResponse } from '../interfaces';

export const loginUser = async ({
  email,
  password,
}: SignInRequest): Promise<SignInResponse> => {
  try {
    const res = await httpClient.post<SignInResponse>('auth/signin', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return res;
  } catch (error) {
    console.error('Error caught in loginUser:', error);
    return handleApiErrors(error, 'loginUser');
  }
};
