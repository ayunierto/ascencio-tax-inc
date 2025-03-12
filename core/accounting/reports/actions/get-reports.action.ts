import * as SecureStore from 'expo-secure-store';
import { Report } from '../interfaces';

export const getReports = async (
  limit = 100,
  offset = 0
): Promise<Report[]> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(
      `${API_URL}/reports?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data: Report[] = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Unable to load reports');
  }
};
