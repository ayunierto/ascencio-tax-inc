import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';

import { signinSchema } from '../schemas/signinSchema';
import { useAuthStore } from '../store/useAuthStore';

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
      return await signin(values);
    },
    onSuccess: (response, variables) => {
      console.warn({ SigninResponse: response });
      if ('token' in response) {
        router.push('/(tabs)/(home)');
        return;
      }

      if (
        'message' in response &&
        response.message === 'User is not verified'
      ) {
        setUser({
          email: variables.username,
          id: '',
          name: '',
          lastName: '',
          phoneNumber: '',
          isActive: false,
          roles: [],
          createdAt: '',
        });
        router.push({ pathname: '/auth/verify', params: { action: 'verify' } });
        return;
      }

      if ('message' in response) {
        console.log('Error de API recibido:', response.message);
        setError('root', {
          // Shows the error in the form
          type: 'manual',
          message:
            response.message ||
            "We didn't recognize the username or password you entered. Please try again.",
        });
      } else {
        // Caso inesperado donde la respuesta no es ni UserToken ni Exception conocida
        console.error('Unexpected response of meaning::', response);
        setError('root', {
          type: 'manual',
          message: 'An unexpected response was received from the server.',
        });
      }
    },
    onError: (error) => {
      // Se ejecuta si executeSigninInStore (o la acción 'signin' subyacente) lanza un error.
      // Típicamente errores de red o excepciones no capturadas.
      console.error('Error en la mutación (onError):', error);
      setError('root', {
        // Muestra un error genérico en el formulario
        type: 'manual',
        message:
          error.message || 'An network error occurred. Please try again.',
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
