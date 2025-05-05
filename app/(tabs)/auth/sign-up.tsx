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
import { useSignup } from '@/core/auth/hooks/useSignup';
import { useCountryCodes } from '@/core/hooks/useCountryCodes';

const Signup = () => {
  const {
    errors,
    control,
    callingCode,
    handleSubmit,
    onSignup,
    setValue,
    loading,
  } = useSignup();

  const { countryCodes } = useCountryCodes();

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
              <ErrorMessage message={errors.root?.message} />

              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="First Name"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="First Name"
                    autoCapitalize="words"
                    autoComplete="name"
                    errorMessage={errors.name?.message}
                    error={!!errors.name}
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Last Name"
                    placeholder="Last Name"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    autoComplete="name-family"
                    errorMessage={errors.lastName?.message}
                    error={!!errors.lastName}
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
                    placeholder="Email"
                    autoCapitalize="none"
                    autoComplete="email"
                    errorMessage={errors.email?.message}
                    error={!!errors.email}
                  />
                )}
              />

              <View style={{ gap: 10 }}>
                <View style={{ flexDirection: 'row', gap: 10, flex: 1 }}>
                  <Select
                    options={countryCodes}
                    selectedOptions={countryCodes.find(
                      (item) => item.value === callingCode
                    )}
                    // onSelect={(item) => setValue('countryCode', item?.value)}
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
                        style={{ flex: 2 }}
                        errorMessage={errors.phoneNumber?.message}
                        error={!!errors.phoneNumber}
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
                    errorMessage={errors.password?.message}
                    error={!!errors.password}
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
                      errorMessage={errors.confirmPassword?.message}
                      error={!!errors.confirmPassword}
                    />
                  )}
                />
              </View>
            </View>

            <Button
              loading={loading}
              disabled={loading}
              onPress={handleSubmit(onSignup)}
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

export default Signup;
