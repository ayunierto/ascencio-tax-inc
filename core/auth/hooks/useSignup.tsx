import useIPGeolocation from '@/core/hooks/useIPGeolocation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { signupSchema } from '../schemas/signupSchema';
import { z } from 'zod';
import { useAuthStore } from '../store/useAuthStore';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

export const useSignup = () => {
  const { location } = useIPGeolocation();
  const [callingCode, setCallingCode] = useState<string | undefined>();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (location) {
      if ('error' in location) return;
      setCallingCode(`+${location.location.calling_code}`);
      setValue('countryCode', `+${location.location.calling_code}`);
    }
  }, [location]);

  const { signup } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const onSignup = async (
    values: z.infer<typeof signupSchema>
  ): Promise<void> => {
    setLoading(true);
    const response = await signup({
      email: values.email,
      lastName: values.lastName,
      name: values.name,
      password: values.password,
      countryCode: values.countryCode,
      phoneNumber: values.phoneNumber,
    });
    setLoading(false);

    if ('user' in response) {
      router.push({ pathname: '/auth/verify', params: { action: 'verify' } });
      return;
    }

    Toast.show({
      text1: response.error,
      text2: response.message,
      type: 'error',
    });

    setError('root', {
      type: 'manual',
      message: response.message,
    });
  };

  return {
    control,
    handleSubmit,
    errors,
    setValue,
    callingCode,
    onSignup,
    loading,
  };
};
