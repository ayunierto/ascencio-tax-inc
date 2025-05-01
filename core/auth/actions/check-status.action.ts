import * as SecureStore from 'expo-secure-store';
import { Exception } from '@/core/interfaces/exception.interface';

export const checkStatus = async (): Promise<UserToken | Exception> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      return {
        message: 'There is no stored token',
        statusCode: 401,
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_URL}/auth/check-status`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        message: `Error de servidor: ${response.statusText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();

    if (!data.user || !data.token) {
      throw new Error('Respuesta inválida del servidor');
    }

    return data as UserToken;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          message: 'The request exceeded the waiting time',
          statusCode: 408,
        };
      }
      return {
        message: error.message || 'Error desconocido',
        statusCode: 500,
      };
    }
    return {
      message: 'Error inesperado',
      statusCode: 500,
    };
  }
};
