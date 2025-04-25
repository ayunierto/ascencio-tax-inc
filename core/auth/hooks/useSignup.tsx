import useIPGeolocation from '@/core/hooks/useIPGeolocation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { signupSchema } from '../schemas/signupSchema';
import { z } from 'zod';
import { useAuthStore } from '../store/useAuthStore';
import { router } from 'expo-router';

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
      console.warn({ location });
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
      verificationPlatform: 'email',
      email: values.email,
      lastName: values.lastName,
      name: values.name,
      password: values.password,
      countryCode: values.countryCode,
      phoneNumber: values.phoneNumber,
    });
    console.warn({ SignupResponse: response });
    setLoading(false);

    // Success record
    if ('id' in response) {
      router.push({ pathname: '/auth/verify', params: { action: 'verify' } });
      return;
    }

    if (response.statusCode === 400) {
      setError('root', {
        type: 'manual',
        message: response.message,
      });
    }

    if (response.statusCode === 409) {
      if (response.message.toLowerCase().includes('email')) {
        setError('email', {
          type: 'manual',
          message:
            'Your email is already being used by an existing AscencioTax account. You can go the AscencioTax login screen to login using this email.',
        });
        return;
      }
      if (response.message.includes('phoneNumber')) {
        setError('phoneNumber', {
          type: 'manual',
          message:
            'Your phone number is already being used by an existing AscencioTax account. You can go the AscencioTax login screen to login using this phone number.',
        });
        return;
      }
    }
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
