import React, { useEffect, useState } from 'react';

import {
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { router } from 'expo-router';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { countries } from '@/countryData';
import { signupSchema } from '@/core/auth/schemas/signupSchema';
import useIPGeolocation from '@/core/hooks/useIPGeolocation';
import Logo from '@/components/Logo';
import Header from '@/core/auth/components/Header';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import ErrorMessage from '@/core/components/ErrorMessage';
import Button from '@/components/ui/Button';

const countryCodes: { label: string; value: string }[] = [];

const transformCountries = (): void => {
  countries.map((country) => {
    countryCodes.push({
      label: `${country.name} (${country.phone_code})`,
      value: country.phone_code,
    });
  });
};
transformCountries();

const Signup = () => {
  const { location } = useIPGeolocation();
  const [callingCode, setCallingCode] = useState<string | undefined>();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (location) {
      setCallingCode(`+${location.location.calling_code}`);
      setValue('countryCode', `+${location.location.calling_code}`);
    }
  }, [location]);

  const { signup } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const onSignup = async (
    values: z.infer<typeof signupSchema>
  ): Promise<void> => {
    setLoading(true);
    const response = await signup({
      verificationPlatform: 'email',
      email: values.email,
      lastName: values.lastName,
      name: values.name,
      password: values.password,
      countryCode: values.countryCode,
      phoneNumber: values.phoneNumber,
    });
    setLoading(false);

    // Success record
    if ('id' in response) {
      router.push({ pathname: '/auth/verify', params: { action: 'verify' } });
      return;
    }

    if (response.statusCode === 400) {
      setError('root', {
        type: 'manual',
        message: response.message,
      });
    }

    if (response.statusCode === 409) {
      if (response.message.toLowerCase().includes('email')) {
        setError('email', {
          type: 'manual',
          message:
            'Your email is already being used by an existing AscencioTax account. You can go the AscencioTax login screen to login using this email.',
        });
        return;
      }
      if (response.message.includes('phoneNumber')) {
        setError('phoneNumber', {
          type: 'manual',
          message:
            'Your phone number is already being used by an existing AscencioTax account. You can go the AscencioTax login screen to login using this phone number.',
        });
        return;
      }
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView>
          <Logo />
          <View
            style={{
              flex: 1,
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
                      autoComplete="new-password"
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
                      autoComplete="new-password"
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
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
