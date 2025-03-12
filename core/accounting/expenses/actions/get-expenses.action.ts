import * as SecureStore from 'expo-secure-store';
import { Expense } from '../interfaces';

export const getExpenses = async (
  limit = 20,
  offset = 0
): Promise<Expense[]> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(
      `${API_URL}/expense?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data: Expense[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw new Error('Unable to load expenses');
  }
};
