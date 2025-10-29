import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import Header from '../../../core/auth/components/Header';
import { Button, ButtonText } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ForgotPasswordRequest,
  forgotPasswordSchema,
} from '@/core/auth/schemas/forgot-password.schema';
import { useForgotPasswordMutation } from '@/core/auth/hooks/useForgotPasswordMutation';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import Toast from 'react-native-toast-message';

const ForgotPassword = () => {
  const { tempEmail } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: tempEmail || '',
    },
  });

  const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();
  const handleForgotPassword = async (values: ForgotPasswordRequest) => {
    forgotPassword(values, {
      onSuccess: (data) => {
        Toast.show({
          type: 'error',
          text1: 'Email sent',
          text2: data.message,
        });
        router.replace('/auth/reset-password');
      },
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1: 'Forgot Password Error',
          text2: error.response?.data.message || error.message,
        });
      },
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

        <View>
          <Button
            disabled={isPending}
            isLoading={isPending}
            onPress={handleSubmit(handleForgotPassword)}
          >
            <ButtonText>{isPending ? 'Sending...' : 'Send'}</ButtonText>
          </Button>

          <Button
            variant="outline"
            onPress={() => router.replace('/auth/sign-in')}
          >
            <ButtonText>Back</ButtonText>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;
