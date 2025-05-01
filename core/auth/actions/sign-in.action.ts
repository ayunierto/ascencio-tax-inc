import { Exception } from '@/core/interfaces/exception.interface';
import { SigninResponse, SigninRequest } from '../interfaces';

export const signinAction = async (
  credentials: SigninRequest
): Promise<SigninResponse | Exception> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    if (!API_URL) {
      throw new Error('API_URL mising');
    }

    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data: SigninResponse | Exception = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Sign in: Network request failed');
  }
};
