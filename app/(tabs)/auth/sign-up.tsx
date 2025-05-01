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

              <View style={{ gap: 6 }}>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="First name"
                      autoCapitalize="words"
                      autoComplete="name"
                    />
                  )}
                />
                <ErrorMessage fieldErrors={errors.name} />
              </View>

              <View style={{ gap: 6 }}>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Last name"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      autoCapitalize="words"
                      autoComplete="name-family"
                    />
                  )}
                />
                <ErrorMessage fieldErrors={errors.lastName} />
              </View>

              <View style={{ gap: 6 }}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      placeholder="Email"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  )}
                />
                <ErrorMessage fieldErrors={errors.email} />
              </View>

              <View style={{ gap: 6 }}>
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
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                        placeholder="Phone Number"
                        autoCapitalize="none"
                        autoComplete="tel"
                        style={{ flex: 2 }}
                      />
                    )}
                  />
                </View>
                <ErrorMessage fieldErrors={errors.countryCode} />
                <ErrorMessage fieldErrors={errors.phoneNumber} />
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
                      autoCapitalize="none"
                      secureTextEntry
                      placeholder="Password"
                    />
                  )}
                />
                <ErrorMessage fieldErrors={errors.password} />
              </View>

              <View style={{ gap: 6 }}>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      secureTextEntry
                      placeholder="Confirm Password"
                    />
                  )}
                />
                <ErrorMessage fieldErrors={errors.confirmPassword} />
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
