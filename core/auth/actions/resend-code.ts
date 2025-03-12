import { Exception } from '@/core/interfaces/Exception.interface';

export const resendCode = async (
  username: string,
  verificationPlatform: 'email' | 'phone' = 'email'
): Promise<Exception> => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  try {
    const response = await fetch(`${API_URL}/auth/resend-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.toLocaleLowerCase().trim(),
        verificationPlatform: verificationPlatform,
      }),
    });

    const data: Exception = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Error sending verification code');
  }
};
