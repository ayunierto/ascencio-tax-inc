import * as SecureStore from 'expo-secure-store';

export const getUserAppointments = async (
  state: 'pending' | 'past' = 'pending'
) => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = (await SecureStore.getItemAsync('token')) || '';

    const response = await fetch(
      `${API_URL}/appointment/current-user?state=${state}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
