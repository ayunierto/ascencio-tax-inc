import React, { useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { useAuthStore } from '@/core/auth/store/useAuthStore';

import Header from '@/core/auth/components/Header';
import { Input } from '@/components/ui/Input';
import { Button, ButtonText } from '@/components/ui/Button';
import {
  useResendResetPasswordMutation,
  useResetPasswordMutation,
  useTimer,
} from '@/core/auth/hooks';
import {
  ResetPasswordRequest,
  resetPasswordSchema,
} from '@/core/auth/schemas/reset-password.schema';
import { Redirect, router } from 'expo-router';
import Toast from 'react-native-toast-message';

const VerifyCode = () => {
  const { user, tempEmail } = useAuthStore();

  const { isRunning, timeRemaining, startTimer, resetTimer } = useTimer(30);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    startTimer();
    setValue('email', tempEmail || '');

    return () => {
      resetTimer();
    };
  }, []);

  if (!tempEmail) {
    return <Redirect href={'/auth/sign-in'} />;
  }

  const { mutate: verifyEmail, isPending } = useResetPasswordMutation();
  const handleEmailVerification = async (data: ResetPasswordRequest) => {
    verifyEmail(data, {
      onSuccess: (data) => {
        Toast.show({
          type: 'success',
          text1: 'Password Reset Successfully',
          text2: data.message,
        });
        router.replace('/auth/sign-in');
      },
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1: 'Password Reset Error',
          text2: error.response?.data.message || error.message,
        });
      },
    });
    resetTimer();
    startTimer();
  };

  const { mutate: resendResetPasswordCode } = useResendResetPasswordMutation();
  const handleResendPasswordCode = async () => {
    if (isRunning) return;
    resendResetPasswordCode(user?.email || '');
    startTimer();
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView behavior="padding">
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flex: 1,
                gap: 10,
                maxWidth: 320,
                marginHorizontal: 'auto',
              }}
            >
              <Header
                title={'Change your password'}
                subtitle={
                  'Please check your email for a message with your code. Your code is 6 numbers long.'
                }
              />

              <View style={{ gap: 10 }}>
                <Controller
                  control={control}
                  name="code"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Code"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="123456"
                      keyboardType="numeric"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                      maxLength={6}
                      error={!!errors.code}
                      errorMessage={errors.code?.message || ''}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="New Password"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="New Password"
                      keyboardType="default"
                      autoCapitalize="none"
                      error={!!errors.newPassword}
                      errorMessage={errors.newPassword?.message || ''}
                      secureTextEntry
                    />
                  )}
                />
              </View>

              <View>
                <Button
                  disabled={isPending}
                  onPress={handleSubmit(handleEmailVerification)}
                  isLoading={isPending}
                >
                  <ButtonText>
                    {isPending ? 'Verifying...' : 'Verify'}
                  </ButtonText>
                </Button>

                <Button
                  disabled={isPending || isRunning}
                  onPress={handleResendPasswordCode}
                  variant="outline"
                >
                  <ButtonText>
                    {timeRemaining === 0
                      ? 'Resend code'
                      : `Resend in ${timeRemaining}s`}
                  </ButtonText>
                </Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyCode;
