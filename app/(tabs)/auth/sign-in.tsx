import React from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';

import { Controller } from 'react-hook-form';

import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Header from '@/core/auth/components/Header';
import Logo from '@/components/Logo';
import ErrorMessage from '@/core/components/ErrorMessage';
import { theme } from '@/components/ui/theme';
import TermsAndPrivacy from '@/components/TermsAndPrivacy';
import { ThemedText } from '@/components/ui/ThemedText';
import { useSignin } from '@/core/auth/hooks/useSignin';

const SigninScreen = () => {
  const { errors, control, signinMutation, onSigninSubmit, handleSubmit } =
    useSignin();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <Logo />
          <View
            style={{
              flex: 1,
              gap: 20,
              width: '100%',
              maxWidth: 380,
              marginHorizontal: 'auto',
              marginBottom: 20,
              padding: 20,
            }}
          >
            <Header
              subtitle=" Don’t have an account?"
              title={'Sign In'}
              link="/auth/sign-up"
              linkText="Sign Up"
            />
            <View style={{ gap: 10 }}>
              <ErrorMessage message={errors.root?.message} />

              <View style={{ gap: 6 }}>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      placeholder="Email or phone number"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  )}
                />
                <ErrorMessage fieldErrors={errors.username} />
              </View>

              <View style={{ gap: 6 }}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      secureTextEntry={true}
                      placeholder="Enter password"
                      autoComplete="password"
                      autoCapitalize="none"
                    />
                  )}
                />
                <ErrorMessage fieldErrors={errors.password} />
              </View>
            </View>
            <ThemedText
              style={{ color: theme.primary, textAlign: 'center' }}
              onPress={() =>
                !signinMutation.isPending &&
                router.push('/auth/forgot-password')
              }
            >
              Forgot password?
            </ThemedText>
            <Button
              loading={signinMutation.isPending}
              disabled={signinMutation.isPending}
              onPress={handleSubmit(onSigninSubmit)}
              focusable
            >
              Log In
            </Button>

            <TermsAndPrivacy />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SigninScreen;
