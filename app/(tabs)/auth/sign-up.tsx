import React from 'react';

import {
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Controller } from 'react-hook-form';

import Logo from '@/components/Logo';
import Header from '@/core/auth/components/Header';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import ErrorMessage from '@/core/components/ErrorMessage';
import Button from '@/components/ui/Button';
import TermsAndPrivacy from '@/components/TermsAndPrivacy';
import { useCountryCodes } from '@/core/hooks/useCountryCodes';
import { useSignUp } from '@/core/auth/hooks';

const SignUp = () => {
  const { countryCodes } = useCountryCodes();
  const {
    formErrors,
    control,
    callingCode,
    handleSubmit,
    onSignUp,
    setValue,
    isPending,
  } = useSignUp();

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView>
          <Logo />
          <View
            style={{
              gap: 20,
              width: '100%',
              maxWidth: 380,
              marginHorizontal: 'auto',
              padding: 20,
            }}
          >
            <Header
              link={'/auth/sign-in'}
              linkText="Sign In"
              subtitle="Already have an account? "
              title="Sign Up"
            />

            <View style={{ gap: 10 }}>
              <ErrorMessage message={formErrors.root?.message} />

              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="First name"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    autoComplete="name"
                    errorMessage={formErrors.firstName?.message}
                    error={!!formErrors.firstName}
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Last name"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    autoComplete="name-family"
                    errorMessage={formErrors.lastName?.message}
                    error={!!formErrors.lastName}
                  />
                )}
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
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    errorMessage={formErrors.email?.message}
                    error={!!formErrors.email}
                  />
                )}
              />

              {/* Phone Number */}
              <View>
                <View style={{ flexDirection: 'row', gap: 10, flex: 1 }}>
                  <Select
                    options={countryCodes}
                    selectedOptions={countryCodes.find(
                      (item) => item.value === callingCode
                    )}
                    onChange={(value) => setValue('countryCode', value)}
                    placeholder="+1"
                    style={{ flex: 3 }}
                  />

                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Phone Number"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                        placeholder="Phone Number"
                        autoCapitalize="none"
                        autoComplete="tel"
                        rootStyle={{ flex: 2 }}
                        errorMessage={formErrors.phoneNumber?.message}
                        error={!!formErrors.phoneNumber}
                      />
                    )}
                  />
                </View>
              </View>

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    secureTextEntry
                    placeholder="Password"
                    errorMessage={formErrors.password?.message}
                    error={!!formErrors.password}
                  />
                )}
              />

              <View style={{ gap: 6 }}>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Confirm Password"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      secureTextEntry
                      placeholder="Confirm Password"
                      errorMessage={formErrors.confirmPassword?.message}
                      error={!!formErrors.confirmPassword}
                    />
                  )}
                />
              </View>
            </View>

            <Button
              loading={isPending}
              disabled={isPending}
              onPress={handleSubmit(onSignUp)}
            >
              Sign up
            </Button>

            <TermsAndPrivacy />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
