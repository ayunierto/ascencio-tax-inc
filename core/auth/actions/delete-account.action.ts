import * as SecureStore from 'expo-secure-store';
import { User } from '../interfaces';
import { Exception } from '@/core/interfaces/exception.interface';

export const deleteAccount = async (): Promise<User | Exception> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${API_URL}/auth/delete-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data: User | Exception = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Delete Account: Network request failed');
  }
};
