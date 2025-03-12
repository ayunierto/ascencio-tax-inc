import * as SecureStore from 'expo-secure-store';
import { UserTokenResponse } from '../interfaces/signin-response.interface';
import { Exception } from '@/core/interfaces/Exception.interface';

export const checkStatus = async (): Promise<UserTokenResponse | Exception> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = (await SecureStore.getItemAsync('token')) || '';

    const response = await fetch(`${API_URL}/auth/check-status`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: UserTokenResponse | Exception = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Network request failed');
  }
};
