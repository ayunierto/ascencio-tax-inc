import * as SecureStore from 'expo-secure-store';
import { CreateUpdateExpense, Expense } from '../interfaces';
import { uploadImage } from '@/core/files/actions/upload-image.action';

export const createExpense = async (
  expense: CreateUpdateExpense
): Promise<Expense> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    if (expense.image) {
      const uploadedImage = await uploadImage(expense.image);
      expense.image = uploadedImage.image;
    }

    const response = await fetch(`${API_URL}/expense`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(expense),
    });
    const data: Expense = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('The receipt could not be created');
  }
};
