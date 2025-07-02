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
import { Button } from '@/components/ui/Button';
import {
  useResendResetPasswordMutation,
  useResetPasswordMutation,
  useTimer,
} from '@/core/auth/hooks';
import {
  ResetPasswordFormInputs,
  resetPasswordSchema,
} from '@/core/auth/schemas';

const VerifyCode = () => {
  const { user } = useAuthStore();

  const { isRunning, timeRemaining, startTimer, resetTimer } = useTimer(30);
  useEffect(() => {
    startTimer();
    setValue('email', user?.email || '');

    return () => {
      resetTimer();
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutate: verifyEmail, isPending } = useResetPasswordMutation();
  const handleEmailVerification = async (data: ResetPasswordFormInputs) => {
    verifyEmail(data);
    resetTimer();
    startTimer();
  };

  const { mutate: resendResetPasswordCode, isPending: isLoadingResend } =
    useResendResetPasswordMutation();
  const handleResendPasswordCode = async () => {
    if (isRunning) return;
    resendResetPasswordCode({ email: user?.email || '' });
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
                    />
                  )}
                />
              </View>

              <Button
                disabled={isPending}
                loading={isPending}
                onPress={handleSubmit(handleEmailVerification)}
              >
                Change Password
              </Button>
              <Button
                disabled={isPending || isRunning}
                loading={isLoadingResend}
                onPress={handleResendPasswordCode}
                variant="outlined"
              >
                {timeRemaining === 0
                  ? 'Resend code'
                  : `Resend in ${timeRemaining}s`}
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyCode;
