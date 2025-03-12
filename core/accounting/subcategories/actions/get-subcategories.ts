import * as SecureStore from 'expo-secure-store';
import { Subcategory } from '../interfaces';

export const getSubcategories = async (): Promise<Subcategory[]> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${API_URL}/subcategory`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: Subcategory[] = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Unable to load subcategories');
  }
};
