import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { SignInRequest, signInSchema } from '../schemas';
import { useSignInMutation } from './useSignInMutation';
import { useAuthStore } from '../store/useAuthStore';

export const useSignIn = () => {
  const { user } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<SignInRequest>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: user?.email || '',
      password: '',
    },
  });

  const { mutate: signIn, isPending, isError, error } = useSignInMutation();

  const handleSignIn = (values: SignInRequest) => {
    signIn(values);
  };

  return {
    formErrors,
    control,
    isPending,
    isError,
    error,
    handleSignIn,
    handleSubmit,
  };
};
