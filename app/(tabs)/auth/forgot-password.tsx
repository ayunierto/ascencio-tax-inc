import React, { useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

import Header from '../../../core/auth/components/Header';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onForgotPassword = async (
    values: z.infer<typeof forgotPasswordSchema>
  ) => {
    setIsLoading(true);
    const response = await forgotPassword(values);
    setIsLoading(false);

    Toast.show({
      text1: 'Code sended',
      text1Style: { fontSize: 14 },
      text2: response.message,
      text2Style: { fontSize: 12 },
    });
    router.push({
      pathname: '/auth/verify',
      params: { action: 'reset-password' },
    });
  };

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          gap: 20,
          padding: 20,
          width: '100%',
          maxWidth: 360,
          marginHorizontal: 'auto',
        }}
      >
        <Header
          title="Find your account"
          subtitle="Please enter your email or mobile number to search for your account."
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              errorMessage={errors.email?.message}
              error={!!errors.email}
            />
          )}
        />

        <Button
          disabled={isLoading}
          loading={isLoading}
          onPress={handleSubmit(onForgotPassword)}
        >
          Reset Password
        </Button>

        <Button
          variant="outlined"
          onPress={() => router.replace('/auth/sign-in')}
        >
          Back
        </Button>
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;
