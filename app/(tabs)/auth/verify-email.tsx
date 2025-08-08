import React, { useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { useAuthStore } from '@/core/auth/store/useAuthStore';

import { useTimer } from '@/core/auth/hooks/useTimer';
import Header from '@/core/auth/components/Header';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import ErrorMessage from '@/core/components/ErrorMessage';
import { useVerifyEmailMutation } from '@/core/auth/hooks/useVerifyEmailMutation';
import { useResendEmailCodeMutation } from '@/core/auth/hooks/useResendEmailCodeMutation';
import {
  VerifyEmailCodeRequest,
  verifyEmailCodeSchema,
} from '@/core/auth/schemas';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/components/ui/theme';

const VerifyEmail = () => {
  const { user } = useAuthStore();
  const { timeRemaining, isRunning, startTimer, resetTimer } = useTimer(30); // 60 seconds countdown

  useEffect(() => {
    startTimer();

    return () => {
      resetTimer();
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailCodeRequest>({
    resolver: zodResolver(verifyEmailCodeSchema),
    defaultValues: {
      email: user?.email || '',
      code: '',
    },
  });

  // Handle email verification
  const { mutate: verifyEmail, isPending } = useVerifyEmailMutation();
  const handleEmailVerification = async (data: VerifyEmailCodeRequest) => {
    if (user) {
      verifyEmail(data);
    }
    return;
  };

  const { mutate: resendEmailCode, isPending: isLoadingResend } =
    useResendEmailCodeMutation();

  const handleResendVerificationCode = async () => {
    if (user && user.email) {
      if (isRunning) return;
      resendEmailCode(user.email);

      resetTimer();
      startTimer();
    }
  };

  if (!user) {
    return (
      <SafeAreaView>
        <View style={{ padding: 20 }}>
          <Header title="Error" subtitle="User not found" />
        </View>
      </SafeAreaView>
    );
  }

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
                gap: 30,
                maxWidth: 320,
                marginHorizontal: 'auto',
              }}
            >
              <Header
                title={'Verify email'}
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
                      keyboardType="numeric"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                      maxLength={6}
                      error={!!errors.code}
                      errorMessage={errors.code?.message}
                    />
                  )}
                />
                <ErrorMessage fieldErrors={errors.email} />

                <Button
                  disabled={isPending}
                  loading={isPending}
                  onPress={handleSubmit(handleEmailVerification)}
                >
                  Verify
                </Button>

                <Button
                  disabled={isLoadingResend || isRunning}
                  loading={isLoadingResend}
                  onPress={handleResendVerificationCode}
                  variant="outlined"
                  iconLeft={
                    <Ionicons
                      name="time-outline"
                      size={24}
                      color={theme.foreground}
                    />
                  }
                >
                  {timeRemaining === 0
                    ? 'Resend code'
                    : `Resend in ${timeRemaining}s`}
                </Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyEmail;
