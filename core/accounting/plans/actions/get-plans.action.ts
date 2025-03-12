import * as SecureStore from 'expo-secure-store';
import { Plan } from '../interfaces/plan.interface';

export const GetPlans = async (): Promise<Plan[]> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }
    const response = await fetch(`${API_URL}/plans`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: Plan[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw new Error('Failed to fetch plans');
  }
};
