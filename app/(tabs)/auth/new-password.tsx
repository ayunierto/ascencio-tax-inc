import { View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { z } from 'zod';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Header from '../../../core/auth/components/Header';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/core/components/ErrorMessage';

export const newPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  // .regex(
  //   /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  //   'The password must have a Uppercase, lowercase letter and a number'
  // ),
});

const NewPasswordScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { changePassword } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
  });

  const onChangePassword = async ({
    password,
  }: z.infer<typeof newPasswordSchema>) => {
    setIsLoading(true);
    const response = await changePassword(password);
    console.warn({ NewPasswordResponse: response });
    setIsLoading(false);

    if ('token' in response) {
      router.replace('/auth/sign-in');
      Toast.show({
        type: 'success',
        text1: `Please sign in`,
        text2: 'Password changed successfully',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 12 },
      });
      return;
    }

    setError('password', {
      type: 'manual',
      message: '. Please check your message or talk to an administrator',
    });

    return;
  };

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          gap: 20,
          marginTop: 20,
          padding: 20,
          width: '100%',
          maxWidth: 360,
          marginHorizontal: 'auto',
        }}
      >
        <Header
          title="Choose a new password"
          subtitle={
            'Create a new password that is at least 6 characters long. A strong password is combination of letters, numbers, and punctuation marks.'
          }
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="New Password"
              autoCapitalize="none"
            />
          )}
        />
        <ErrorMessage fieldErrors={errors.password} />

        <Button
          disabled={isLoading}
          loading={isLoading}
          onPress={handleSubmit(onChangePassword)}
        >
          Change Password
        </Button>
      </View>
    </ScrollView>
  );
};

export default NewPasswordScreen;
