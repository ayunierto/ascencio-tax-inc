import * as SecureStore from 'expo-secure-store';
import { Exception } from '@/core/interfaces/Exception.interface';
import { Subscription } from '../interfaces/subscription.interface';

export const getSubscriptions = async (): Promise<
  Subscription[] | Exception
> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${API_URL}/subscriptions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data: Subscription[] | Exception = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('The subscriptions could not getting');
  }
};
