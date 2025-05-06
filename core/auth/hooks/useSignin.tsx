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
      // Llama a la función del store que usa signinAction
      const response = await signin(values); // signin viene de useAuthStore

      // IMPORTANTE: Tu función `signin` en useAuthStore ahora retorna
      // SigninResponse en caso de éxito, o Exception en caso de error.
      // TanStack Query considerará una Exception retornada como un "éxito"
      // en términos de la promesa. Debes lanzar un error aquí si
      // recibes una Exception para que se active `onError`.

      if (
        response &&
        typeof response === 'object' &&
        'statusCode' in response &&
        typeof response.statusCode === 'number' &&
        response.statusCode >= 400
      ) {
        // Es una Exception retornada por la action, lánzala para que onError la capture
        const errorToThrow = new Error(response.message || 'API Error');
        (errorToThrow as any).originalError = response; // Adjunta la data original si quieres
        throw errorToThrow;
      }

      // Verifica si la respuesta es realmente SigninResponse
      if (!response || typeof response !== 'object' || !('token' in response)) {
        console.error(
          'Invalid success response structure after signin action:',
          response
        );
        throw new Error('Unexpected response format from signin.');
      }

      // Si todo va bien, retorna la respuesta exitosa
      return response as import('../interfaces').SigninResponse; //
    },
    onSuccess: (response) => {
      // Esta lógica ahora solo se ejecuta si mutationFn retorna SigninResponse
      console.log('Signin successful:', response);
      if ('token' in response) {
        // Esta verificación puede ser redundante ahora
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
    console.log('Send form with:', values);
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
