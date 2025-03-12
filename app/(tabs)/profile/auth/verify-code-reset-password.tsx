import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { verifyUserSchema } from '@/core/auth/schemas/verifyUserSchema';
import { useCanResendCode } from '@/core/auth/hooks/useCanResendCode';
import { resendCode } from '@/core/auth/actions/resend-code';
import Header from '@/core/auth/components/Header';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/core/components/ErrorMessage';

const VerifyCodeResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, verifyCode } = useAuthStore();

  const {
    timer,
    canResend,
    isLoadingResend,
    setIsLoadingResend,
    setTimer,
    setCanResend,
  } = useCanResendCode();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof verifyUserSchema>>({
    resolver: zodResolver(verifyUserSchema),
    defaultValues: {
      verificationCode: '',
    },
  });

  const handleVerify = async ({
    verificationCode,
  }: z.infer<typeof verifyUserSchema>) => {
    if (user) {
      setIsLoading(true);
      const response = await verifyCode(user!.email, verificationCode);
      setIsLoading(false);

      if ('token' in response) {
        router.push('/(tabs)/profile/auth/new-password');
      }

      if ('statusCode' in response && response.statusCode === 401) {
        setError('verificationCode', {
          type: 'manual',
          message:
            response.message +
            '. Please check your message or talk to an administrator',
        });
        return;
      }
    }
    return;
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoadingResend(true);
    const verificationPlatform = 'email';
    if (user) {
      await resendCode(user.email, verificationPlatform);
      Toast.show({
        type: 'success',
        text1: 'Code sent',
        text2: `Please check your ${verificationPlatform}`,
      });
      setIsLoadingResend(false);
      setTimer(30);
    }
    setCanResend(false);
  };

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          gap: 20,
          padding: 20,
          width: '100%',
          maxWidth: 320,
          marginHorizontal: 'auto',
        }}
      >
        <Header
          title={'Enter security code'}
          subtitle={
            'Please check your email for a message with your code. Your code is 6 numbers long.'
          }
        />

        <Controller
          control={control}
          name="verificationCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Verification code"
              keyboardType="numeric"
            />
          )}
        />
        <ErrorMessage fieldErrors={errors.verificationCode} />

        <Button
          disabled={isLoading}
          loading={isLoading}
          onPress={handleSubmit(handleVerify)}
        >
          Verify
        </Button>
        <Button
          disabled={!canResend}
          loading={isLoadingResend}
          onPress={handleResendCode}
          variant="outlined"
        >
          {canResend ? 'Resend code' : `Resend in ${timer}s`}
        </Button>
      </View>
    </ScrollView>
  );
};

export default VerifyCodeResetPassword;
