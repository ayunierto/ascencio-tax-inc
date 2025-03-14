import { Exception } from '@/core/interfaces/Exception.interface';
import { UserToken, Credentials } from '../interfaces';

export const signin = async (
  credentials: Credentials
): Promise<UserToken | Exception> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data: UserToken | Exception = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Sign in: Network request failed');
  }
};
