import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import Header from '../../../core/auth/components/Header';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ForgotPasswordRequest,
  forgotPasswordSchema,
} from '@/core/auth/schemas';
import { useForgotPasswordMutation } from '@/core/auth/hooks/useForgotPasswordMutation';

const ForgotPassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();
  const handleForgotPassword = async (values: ForgotPasswordRequest) => {
    forgotPassword(values);
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
          disabled={isPending}
          loading={isPending}
          onPress={handleSubmit(handleForgotPassword)}
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
