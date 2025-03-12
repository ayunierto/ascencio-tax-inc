import * as SecureStore from 'expo-secure-store';
import { DiscountOnPlan } from '../interfaces/discount-on-plan.interface';

export const GetDiscountsOnPlans = async (): Promise<DiscountOnPlan[]> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }
    const response = await fetch(`${API_URL}/discounts-on-plans`, {
      method: 'GET',
      headers: {
        // Authorization: `Bearer ${token}`,
      },
    });
    const data: DiscountOnPlan[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching discounts:', error);
    throw new Error('Failed to fetch discounts');
  }
};
