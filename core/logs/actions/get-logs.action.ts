import * as SecureStore from 'expo-secure-store';
import { Log } from '../interfaces';

export const getLogs = async (limit = 6, offset = 0): Promise<Log[]> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(
      `${API_URL}/logs?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data: Log[] = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Unable to load logs');
  }
};
