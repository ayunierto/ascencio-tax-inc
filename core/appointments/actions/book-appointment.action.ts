import * as SecureStore from 'expo-secure-store';

interface Appointment {
  startDateAndTime: string;
  endDateAndTime: string;
  service: string;
  staff: string;
  comments?: string;
}

export const bookAppointment = async ({
  startDateAndTime,
  endDateAndTime,
  service,
  staff,
  comments = '',
}: Appointment) => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const token = (await SecureStore.getItemAsync('token')) || '';

  try {
    const response = await fetch(`${API_URL}/appointment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        startDateAndTime,
        endDateAndTime,
        service,
        staff,
        comments,
      }),
      redirect: 'follow',
    });
    const data: Appointment = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving appointment:', error);
    return error;
  }
};
