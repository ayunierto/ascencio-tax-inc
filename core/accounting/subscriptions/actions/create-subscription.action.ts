import * as SecureStore from 'expo-secure-store';
import { Exception } from '@/core/interfaces/Exception.interface';
import { Subscription } from '../interfaces/subscription.interface';

interface CreateSubscription {
  planId: string;
  durationInMonths: number;
}

export const createSubscription = async (
  subscription: CreateSubscription
): Promise<Subscription | Exception> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${API_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });
    const data: Subscription | Exception = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('The subscription could not be created');
  }
};
