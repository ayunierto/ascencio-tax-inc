import { Exception } from '@/core/interfaces/exception.interface';
import { SigninResponse } from '../interfaces';
import { httpClient } from '@/core/adapters/http/fetch.adapter';
import {
  HttpError,
  NetworkError,
} from '@/core/adapters/http/http-adapter.interface';

export const checkStatus = async (): Promise<SigninResponse | Exception> => {
  try {
    // const API_URL = process.env.EXPO_PUBLIC_API_URL;

    // const token = await SecureStore.getItemAsync('token');
    // if (!token) {
    //   return {
    //     message: 'There is no stored token',
    //     statusCode: 401,
    //     error: 'Unauthorized',
    //   };
    // }

    // const controller = new AbortController();
    // const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await httpClient.get<SigninResponse>(
      '/auth/check-status',
      {}
    );
    return response;
    // const response = await fetch(`${API_URL}/auth/check-status`, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   },
    //   signal: controller.signal,
    // });

    // clearTimeout(timeoutId);

    // if (!response.ok) {
    //   console.error('Error en la respuesta del servidor:', response.statusText);
    //   return {
    //     message: `Error de servidor: ${response.statusText}`,
    //     statusCode: response.status,
    //     error: response.statusText,
    //   };
    // }

    // const data = await response.json();

    // if (!data.user || !data.token) {
    //   throw new Error('Respuesta inválida del servidor');
    // }

    // return data as SigninResponse;
  } catch (error) {
    // El adaptador ya ha manejado y clasificado el error (NetworkError, HttpError)
    console.error('Error caught in signinAction:', error);

    // Si es un error HTTP con datos (posiblemente formato Exception)
    if (error instanceof HttpError && error.errorData) {
      // Puedes retornar directamente los datos del error si coinciden con tu tipo Exception
      // O puedes crear un nuevo objeto Exception basado en HttpError
      return {
        message: error.message,
        statusCode: error.statusCode,
        error: error.errorData?.error || 'Http Error', // Intenta obtener el 'error' del cuerpo
        // ... otros campos de Exception si existen en errorData
      } as Exception;
    }

    // Si es un error de Red
    if (error instanceof NetworkError) {
      return {
        message: error.message,
        statusCode: 408, // O 503 Service Unavailable, o 0 podría ser más representativo
        error: 'Network Error',
      } as Exception;
    }

    // Si es un HttpError sin datos específicos o cualquier otro error
    if (error instanceof Error) {
      return {
        message: error.message,
        // Intenta obtener el statusCode si es HttpError, sino usa 500
        statusCode: error instanceof HttpError ? error.statusCode : 500,
        error: error.name, // 'HttpError', 'NetworkError', o 'Error'
      } as Exception;
    }

    // Fallback para errores desconocidos
    return {
      message: 'An unexpected error occurred in signinAction.',
      statusCode: 500,
      error: 'Unknown Error',
    } as Exception;
  }
};
