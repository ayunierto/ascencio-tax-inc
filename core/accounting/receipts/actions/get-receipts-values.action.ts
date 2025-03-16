import { Exception } from '@/core/interfaces/exception.interface';
import * as SecureStore from 'expo-secure-store';

interface DetectedValues {
  merchant: string;
  date: string;
  total: string;
  tax: string;
}

export const getReceiptValues = async (
  base64Image: string
): Promise<DetectedValues | Exception> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${API_URL}/aws/analyze-expense`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ base64Image: base64Image }),
    });
    const data: DetectedValues | Exception = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Could not get receipt values');
  }
};
