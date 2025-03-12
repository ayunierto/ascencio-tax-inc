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

const Signup = (): JSX.Element => {
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
    defaultValues: {},
  });

  useEffect(() => {
    if (location) {
      // setValue('countryCode', `+${location.location.calling_code}` || '');
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
    delete values.confirmPassword;
    const response = await signup({ ...values, verificationPlatform: 'email' });
    setLoading(false);

    if ('email' in response) {
      router.push('/(tabs)/profile/auth/verify');
    }

    if ('statusCode' in response) {
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
              maxWidth: 320,
              marginHorizontal: 'auto',
              marginBottom: 20,
            }}
          >
            <Header
              link={'/(tabs)/profile/auth/sign-in'}
              linkText="Sign In"
              subtitle="Already have an account? "
              title="Sign Up"
            />

            <View style={{ gap: 10 }}>
              {/* <ErrorMessage fieldErrors={errors.root} /> */}

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

              {/* Country code and phone number */}
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <Select
                  options={countryCodes}
                  selectedOptions={countryCodes.find(
                    (item) => item.value === callingCode
                  )}
                  // onSelect={(item) => setValue('countryCode', item?.value)}
                  onChange={(value) => setValue('countryCode', value)}
                  placeholder="+1"
                  style={{ flex: 1 }}
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
                    autoComplete="password-new"
                  />
                )}
              />
              <ErrorMessage fieldErrors={errors.password} />

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
                    autoComplete="password-new"
                  />
                )}
              />
              <ErrorMessage fieldErrors={errors.confirmPassword} />

              <Button
                loading={loading}
                disabled={loading}
                onPress={handleSubmit(onSignup)}
              >
                Sign up
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
