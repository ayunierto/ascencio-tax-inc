import { Exception } from '@/core/interfaces/Exception.interface';
import { UserToken } from '../interfaces';

export const verifyCode = async (
  username: string,
  verificationCode: string
): Promise<UserToken | Exception> => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  try {
    const response = await fetch(`${API_URL}/auth/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, verificationCode }),
    });

    const data: UserToken | Exception = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Verify Code: Network request failed');
  }
};
