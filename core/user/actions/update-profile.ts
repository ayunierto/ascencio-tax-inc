import { User } from '@/core/auth/interfaces/user.interface';
import { UpdateProfile } from '../interfaces/update-profile.interface';
import * as SecureStore from 'expo-secure-store';
import { Exception } from '@/core/interfaces/Exception.interface';

export const updateProfile = async ({
  lastName,
  name,
  password,
  phoneNumber,
}: UpdateProfile): Promise<User | Exception> => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const token = (await SecureStore.getItemAsync('token')) || '';

  const userUpdate = {
    lastName,
    name,
    password,
    phoneNumber,
  };

  if (!password) {
    delete userUpdate.password;
  }

  if (!phoneNumber) {
    delete userUpdate.phoneNumber;
  }

  try {
    const response = await fetch(`${API_URL}/users/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userUpdate),
    });
    const data: User | Exception = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Error updating profile');
  }
};
