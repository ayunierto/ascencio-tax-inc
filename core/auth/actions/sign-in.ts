import { Exception } from '@/core/interfaces/Exception.interface';
import { UserTokenResponse } from '../interfaces/signin-response.interface';
import { Credentials } from '../interfaces/credentials.interface';

export const signin = async (
  credentials: Credentials
): Promise<UserTokenResponse | Exception> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data: UserTokenResponse | Exception = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Network request failed');
  }
};
