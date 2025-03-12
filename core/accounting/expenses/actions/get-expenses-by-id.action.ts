import * as SecureStore from 'expo-secure-store';
import { Expense } from '../interfaces';

export const getExpenseById = async (id: string): Promise<Expense> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${API_URL}/expense/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: Expense = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Unable to load expense');
  }
};
