import * as SecureStore from 'expo-secure-store';

export const checkSubscription = async (): Promise<boolean> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${API_URL}/subscriptions/check`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const { hasSubscription }: { hasSubscription: boolean } =
      await response.json();
    return hasSubscription;
  } catch (error) {
    console.error('Error checking subscription:', error);
    throw new Error('The subscription could not be getting');
  }
};
