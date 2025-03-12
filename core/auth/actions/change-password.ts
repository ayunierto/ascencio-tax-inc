import * as SecureStore from 'expo-secure-store';
import { UserTokenResponse } from '../interfaces/signin-response.interface';
import { Exception } from '@/core/interfaces/Exception.interface';

export const changePassword = async (
  password: string
): Promise<UserTokenResponse | Exception> => {
  try {
    const token = (await SecureStore.getItemAsync('token')) || '';
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    const data: UserTokenResponse | Exception = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Network request failed');
  }
};
