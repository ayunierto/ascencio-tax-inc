import * as SecureStore from 'expo-secure-store';
import { Category } from '../interfaces';

export const getCategories = async (): Promise<Category[]> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${API_URL}/categories`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: Category[] = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Unable to load categories');
  }
};
