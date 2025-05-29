/* eslint-disable @typescript-eslint/no-explicit-any */
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { signinSchema } from '../schemas/signinSchema';
import { useAuthStore } from '../store/useAuthStore';
import { Exception } from '@/core/interfaces/exception.interface';

export const useSignin = () => {
  type SigninFormData = z.infer<typeof signinSchema>;

  const { signin, setUser } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const signinMutation = useMutation({
    mutationFn: async (values: SigninFormData) => {
      const response = await signin(values);

      if (
        response &&
        typeof response === 'object' &&
        'statusCode' in response &&
        typeof response.statusCode === 'number' &&
        response.statusCode >= 400
      ) {
        const errorToThrow = new Error(response.message || 'API Error');
        (errorToThrow as any).originalError = response; // Adjunta la data original si quieres
        throw errorToThrow;
      }

      if (!response || typeof response !== 'object' || !('token' in response)) {
        console.error(
          'Invalid success response structure after signin action:',
          response
        );
        throw new Error('Unexpected response format from signin.');
      }

      return response as import('../interfaces').SigninResponse;
    },
    onSuccess: (response) => {
      if ('token' in response) {
        router.push('/(tabs)/(home)');
        return;
      }
      // Si llegas aquí, algo inesperado ocurrió con la estructura de éxito
      setError('root', {
        type: 'manual',
        message: 'Received an unexpected success response structure.',
      });
    },
    onError: (error: any, variables) => {
      console.warn({ error });
      // El error ahora es probablemente Error, con originalError adjunto
      console.error('Error caught by useMutation onError:', error);

      let errorMessage = 'An unexpected error occurred. Please try again.';
      let errorTitle = 'Error';

      // Intenta extraer la información del error original adjunto
      const originalException = error?.originalError as Exception | undefined;

      if (originalException) {
        errorMessage = originalException.message || errorMessage;
        // Podrías diferenciar entre errores de red y otros errores basados en statusCode o el mensaje
        if (
          originalException.error === 'Network Error' ||
          originalException.statusCode === 408
        ) {
          errorTitle = 'Network Error';
        } else if (originalException.statusCode >= 500) {
          errorTitle = 'Server Error';
        } else if (originalException.statusCode >= 400) {
          errorTitle = 'Request Error';
          // Casos específicos como "Please verify your email address." pueden manejarse aquí
          if (
            originalException.message === 'Please verify your email address.'
          ) {
            // Redirige a la pantalla de verificación como antes
            setUser({
              email: variables.email,
              createdAt: '',
              id: '',
              lastName: '',
              name: '',
              roles: [] /* ...otros campos vacíos */,
            }); // Necesitarás 'variables' del contexto si lo haces aquí
            Toast.show({
              text1: 'Please verify your email',
              text1Style: { fontSize: 14 },
            });
            router.push({
              pathname: '/auth/verify',
              params: { action: 'verify' },
            });
            return; // No muestres el error genérico si manejas este caso
          }
        }
      } else if (error instanceof Error) {
        // Si no hay originalError pero es una instancia de Error
        errorMessage = error.message || errorMessage;
      }

      // Muestra el error en el formulario y/o con un Toast
      setError('root', {
        type: 'manual',
        message: errorMessage,
      });

      Toast.show({
        type: 'error',
        text1: errorTitle,
        text2: errorMessage,
      });
    },
  });

  const onSigninSubmit = (values: SigninFormData) => {
    setError('root', { message: '' });
    signinMutation.mutate(values);
  };

  return {
    errors,
    control,
    signinMutation,
    handleSubmit,
    onSigninSubmit,
  };
};
