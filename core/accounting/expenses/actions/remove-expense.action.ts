import * as SecureStore from 'expo-secure-store';
import { Expense } from '../interfaces';

export const removeExpense = async (expenseId: string): Promise<Expense> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${API_URL}/expense/${expenseId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: Expense = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw new Error('Unable to delete expense');
  }
};
