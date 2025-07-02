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
import {
  VerifyEmailFormInputs,
  verifyEmailSchema,
} from '@/core/auth/schemas/verifyEmailSchema';
import { useTimer } from '@/core/auth/hooks/useTimer';
import Header from '@/core/auth/components/Header';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import ErrorMessage from '@/core/components/ErrorMessage';
import { useVerifyEmailMutation } from '@/core/auth/hooks/useVerifyEmailMutation';
import { useResendEmailCodeMutation } from '@/core/auth/hooks/useResendEmailCodeMutation';

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
  } = useForm<VerifyEmailFormInputs>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: user?.email || '',
      code: '',
    },
  });

  // Handle email verification
  const { mutate: verifyEmail, isPending } = useVerifyEmailMutation();
  const handleEmailVerification = async (data: VerifyEmailFormInputs) => {
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
      resendEmailCode({ email: user.email });

      resetTimer();
      startTimer();
    }
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
                      placeholder="123456"
                      keyboardType="numeric"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                      maxLength={6}
                    />
                  )}
                />
                <ErrorMessage fieldErrors={errors.code} />
                <ErrorMessage fieldErrors={errors.email} />
              </View>

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

export default VerifyEmail;
