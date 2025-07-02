import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { SignInFormInputs, signInSchema } from '../schemas';
import { useSignInMutation } from './useSignInMutation';
import { useAuthStore } from '../store/useAuthStore';

export const useSignIn = () => {
  const { user } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<SignInFormInputs>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: user?.email || '',
      password: '',
    },
  });

  const { mutate: signInUser, isPending, isError, error } = useSignInMutation();

  const handleSignIn = (values: SignInFormInputs) => {
    signInUser(values);
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
