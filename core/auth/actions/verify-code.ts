import { Exception } from '@/core/interfaces/Exception.interface';
import { UserTokenResponse } from '../interfaces/signin-response.interface';

export const verifyCode = async (
  username: string,
  verificationCode: string
): Promise<UserTokenResponse | Exception> => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  try {
    const response = await fetch(`${API_URL}/auth/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, verificationCode }),
    });

    const data: UserTokenResponse | Exception = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Network request failed');
  }
};
