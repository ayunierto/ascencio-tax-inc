import { Exception } from '@/core/interfaces/Exception.interface';
import { RegisterData } from '../interfaces/register.data';
import { User } from '../interfaces/user.interface';

export const signup = async (
  newUser: RegisterData
): Promise<User | Exception> => {
  newUser.email = newUser.email.toLocaleLowerCase().trim();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });

    const data: User | Exception = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Network request failed');
  }
};
