import * as SecureStore from 'expo-secure-store';
import { UserToken } from '../interfaces';
import { Exception } from '@/core/interfaces/exception.interface';

export const checkStatus = async (): Promise<UserToken | Exception> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = (await SecureStore.getItemAsync('token')) || '';

    const response = await fetch(`${API_URL}/auth/check-status`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: UserToken | Exception = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Check Status: Network request failed');
  }
};
