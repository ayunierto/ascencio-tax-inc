/* eslint-disable @typescript-eslint/no-explicit-any */
// src/core/adapters/http/fetch-adapter.ts
import * as SecureStore from 'expo-secure-store';
import {
  HttpAdapter,
  RequestOptions,
  NetworkError,
  HttpError,
} from './http-adapter.interface'; // Importa la interfaz y errores
// import { Exception } from '@/core/interfaces/exception.interface'; // Para posible parseo de errores API

const DEFAULT_TIMEOUT = 10000; // 10 segundos de timeout por defecto

export class FetchAdapter implements HttpAdapter {
  private readonly baseUrl: string;

  constructor() {
    let apiUrl = process.env.EXPO_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error(
        'FetchAdapter: EXPO_PUBLIC_API_URL environment variable is not set.'
      );
    }
    if (!apiUrl.endsWith('/')) {
      apiUrl += '/';
    }
    this.baseUrl = apiUrl;
  }

  private async _refreshTokenIfNeeded(): Promise<string | null> {
    // Lógica futura para refrescar token si es necesario
    // Por ahora, solo leemos el token existente
    const token = await SecureStore.getItemAsync('token');
    return token;
  }

  private async _request<T>(
    endpoint: string,
    options: RequestOptions,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' // Añade otros si los implementas
  ): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    console.warn(
      `[FetchAdapter] Attempting ${method} request to: ${url.toString()}`
    ); // <--- AÑADE ESTO

    // Añadir query params si existen
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    // Configuración del Fetch
    const fetchOptions: RequestInit = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers, // Permite sobreescribir o añadir headers
      },
    };

    // Añadir token de autorización si existe
    const token = await this._refreshTokenIfNeeded(); // O simplemente leerlo: await SecureStore.getItemAsync('token');
    if (token) {
      (fetchOptions.headers as Record<string, string>)[
        'Authorization'
      ] = `Bearer ${token}`;
    }

    // Añadir body si existe y el método lo permite
    if (options.body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(options.body);
    }

    // Manejo de Timeout y AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    fetchOptions.signal = controller.signal; // Usa el signal del controller

    // Asociar signal externo si se proporciona
    if (options.signal) {
      options.signal.addEventListener('abort', () => controller.abort());
    }

    try {
      const response = await fetch(url.toString(), fetchOptions);
      clearTimeout(timeoutId); // Limpia el timeout si la respuesta llega

      // Intentar parsear el cuerpo de la respuesta, incluso si no es ok (para errores API)
      let responseData: any;
      try {
        // Intenta parsear como JSON. Si el body está vacío, json() falla.
        const textResponse = await response.text();
        if (textResponse) {
          responseData = JSON.parse(textResponse);
        } else {
          responseData = null; // O un objeto vacío {} si prefieres
        }
      } catch (e) {
        // Si falla el parseo JSON (respuesta no JSON o error)
        console.error('FetchAdapter: Failed to parse JSON response body.', e);
        // Si la respuesta original NO fue ok, lanza HttpError sin datos.
        if (!response.ok) {
          throw new HttpError(
            `HTTP error ${response.status}. Failed to parse response body.`,
            response.status
          );
        }
        // Si la respuesta fue ok pero no se pudo parsear (raro para APIs JSON)
        // podrías lanzar un error o devolver null/undefined según tu contrato.
        // Lanzar un error es más seguro para detectar problemas.
        throw new Error(
          'FetchAdapter: Received OK status but failed to parse response body as JSON.'
        );
      }

      // Si la respuesta no es exitosa (status code fuera de 200-299)
      if (!response.ok) {
        // responseData podría contener el objeto Exception de tu backend
        const errorMessage =
          responseData?.message || `HTTP error ${response.status}`;
        throw new HttpError(errorMessage, response.status, responseData);
      }

      // Si la respuesta es exitosa
      return responseData as T;
    } catch (error) {
      clearTimeout(timeoutId); // Asegúrate de limpiar el timeout también en caso de error

      // Si ya es un HttpError (lanzado por !response.ok), relánzalo
      if (error instanceof HttpError) {
        throw error;
      }

      // Si es un error de AbortController (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('FetchAdapter: Request timed out.');
        throw new NetworkError('The request timed out. Please try again.');
      }

      // Otros errores (fallo de red, DNS, CORS, etc.) se suelen manifestar como TypeError
      if (error instanceof Error) {
        console.error(
          `WorkspaceAdapter: Network or unexpected error during ${method} ${endpoint}:`,
          error
        );
        // Lanza el error de red genérico
        throw new NetworkError(`Unable to complete request. ${error.message}`);
      }

      // Error completamente inesperado
      console.error(
        `WorkspaceAdapter: Unknown error during ${method} ${endpoint}:`,
        error
      );
      throw new Error('An unknown error occurred during the request.');
    }
  }

  // Implementación de los métodos de la interfaz
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this._request<T>(endpoint, options, 'GET');
  }

  async post<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this._request<T>(endpoint, options, 'POST');
  }

  async patch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this._request<T>(endpoint, options, 'PATCH');
  }

  async put<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this._request<T>(endpoint, options, 'PUT');
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this._request<T>(endpoint, options, 'DELETE');
  }
}

// Exportar una instancia única (Singleton) para usar en la app
export const httpClient = new FetchAdapter();
