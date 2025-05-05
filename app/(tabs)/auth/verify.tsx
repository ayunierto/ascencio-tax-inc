import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { verifyUserSchema } from '@/core/auth/schemas/verifyUserSchema';
import { useCanResendCode } from '@/core/auth/hooks/useCanResendCode';
import { resendCode } from '@/core/auth/actions/resend-code.action';
import Header from '@/core/auth/components/Header';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import ErrorMessage from '@/core/components/ErrorMessage';
import { Exception } from '@/core/interfaces/exception.interface';
import {
  ResetPasswordResponse,
  VerifyCodeResponse,
} from '@/core/auth/interfaces';

const VerifyCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const { user, verifyCode, resetPassword } = useAuthStore();
  const { action } = useLocalSearchParams();

  if (!action) {
    throw new Error('Action is required: verify or reset-password');
  }

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
    setValue,
  } = useForm<z.infer<typeof verifyUserSchema>>({
    resolver: zodResolver(verifyUserSchema),
  });

  const onVerify = async ({ code }: z.infer<typeof verifyUserSchema>) => {
    if (user) {
      let response: Exception | VerifyCodeResponse | ResetPasswordResponse;
      if (action === 'verify') {
        setIsLoading(true);
        response = await verifyCode({
          code,
          email: user.email,
        });
        setIsLoading(false);
      } else {
        if (newPassword.length < 6) return;
        setIsLoading(true);

        response = await resetPassword({
          code,
          email: user.email,
          newPassword,
        });
        setIsLoading(false);
      }

      if ('user' in response) {
        router.replace('/auth/sign-in');
        Toast.show({
          type: 'success',
          text1: 'Please sign in',
          text2: response.message,
          text1Style: { fontSize: 14 },
          text2Style: { fontSize: 12 },
        });
        return;
      }

      setValue('code', '');
      setError('code', {
        type: 'manual',
        message: response.message,
      });
    }
    return;
  };

  const onResendCode = async () => {
    if (!canResend) return;
    setIsLoadingResend(true);
    const verificationPlatform = 'email';
    await resendCode(user!.email, verificationPlatform);
    Toast.show({
      type: 'success',
      text1: 'Code sent',
      text2: `Please check your ${verificationPlatform}`,
      text1Style: { fontSize: 14 },
      text2Style: { fontSize: 12 },
    });
    setIsLoadingResend(false);
    setTimer(30);
    setCanResend(false);
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
                title={'Verify'}
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

                {action === 'reset-password' && (
                  <>
                    <Input
                      label="New Password"
                      value={newPassword}
                      onChangeText={(newPassword) =>
                        setNewPassword(newPassword)
                      }
                      placeholder="New Password"
                      keyboardType="default"
                      autoCapitalize="none"
                    />
                    <ErrorMessage
                      message={
                        newPassword.length < 6
                          ? 'Password must be at least 6 characters'
                          : ''
                      }
                    />
                  </>
                )}
              </View>

              <Button
                disabled={isLoading}
                loading={isLoading}
                onPress={handleSubmit(onVerify)}
              >
                {action === 'verify' ? 'Verify' : 'Change Password'}
              </Button>
              <Button
                disabled={!canResend}
                loading={isLoadingResend}
                onPress={onResendCode}
                variant="outlined"
              >
                {canResend ? 'Resend code' : `Resend in ${timer}s`}
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyCode;
