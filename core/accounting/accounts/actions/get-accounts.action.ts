import * as SecureStore from 'expo-secure-store';
import { type Account } from '../interfaces/account.interface';

export const getAccounts = async (
  limit = 10,
  offset = 0
): Promise<Account[]> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(
      `${API_URL}/account?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data: Account[] = await response.json();
    return data;
  } catch (error) {
    throw new Error('Unable to load accounts');
  }
};
