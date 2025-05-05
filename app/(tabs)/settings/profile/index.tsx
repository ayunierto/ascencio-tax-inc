import React, { useEffect, useState } from 'react';

import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { Link } from 'expo-router';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';

import Signin from '../../auth/sign-in';
import { updateProfile } from '@/core/user/actions';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Divider from '@/components/ui/Divider';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import ErrorMessage from '@/core/components/ErrorMessage';
import { theme } from '@/components/ui/theme';
import { useCountryCodes } from '@/core/hooks/useCountryCodes';
import Select from '@/components/ui/Select';
import useIPGeolocation from '@/core/hooks/useIPGeolocation';

export const profileSchema = z
  .object({
    name: z.string().min(3, 'First name must be at least 3 characters'),
    lastName: z.string().min(3, 'First name must be at least 3 characters'),
    email: z.string(),
    countryCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

const ProfileScreen = () => {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuthStore();
  const { countryCodes } = useCountryCodes();
  const [callingCode, setCallingCode] = useState<string | undefined>();

  const { location } = useIPGeolocation();

  useEffect(() => {
    if (location) {
      if ('error' in location) return;
      setCallingCode(`+${location.location.calling_code}`);
      setValue('countryCode', `+${location.location.calling_code}`);
    }
  }, [location]);

  if (!user) {
    return <Signin />;
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user.email,
      lastName: user.lastName,
      name: user.name,
      phoneNumber: user.phoneNumber || '',
    },
  });

  const handleUpdateProfile = async (
    values: z.infer<typeof profileSchema>
  ): Promise<void> => {
    setLoading(true);
    const response = await updateProfile({
      name: values.name,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      password: values.password,
    });
    setLoading(false);

    if ('id' in response) {
      setUser(response);
      reset({
        password: '',
        confirmPassword: '',
        name: response.name,
        lastName: response.lastName,
        phoneNumber: response.phoneNumber || '',
      });
      Toast.show({
        type: 'success',
        text1: 'Data update d successfully',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 12 },
      });
    }

    // Unauthorized
    if ('statusCode' in response && response.statusCode === 400) {
      setError('root', {
        type: 'manual',
        message: response.message,
      });

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.message,
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 12 },
      });
      return;
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView behavior="padding">
          <View
            style={{
              flex: 1,
              gap: 20,
              padding: 20,
              width: '100%',
              maxWidth: 500,
              marginHorizontal: 'auto',
            }}
          >
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="First Name"
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
                  label="Last Name"
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
                  label="Email"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  placeholder="Email"
                  autoCapitalize="none"
                  autoComplete="email"
                  readOnly={true}
                />
              )}
            />
            <ErrorMessage fieldErrors={errors.email} />

            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', gap: 10, flex: 1 }}>
                <Select
                  // label="Country Code"
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
                    />
                  )}
                />
              </View>
              <ErrorMessage fieldErrors={errors.countryCode} />
              <ErrorMessage fieldErrors={errors.phoneNumber} />
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
                  label="Confirm Password"
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
              onPress={handleSubmit(handleUpdateProfile)}
            >
              Update
            </Button>

            <Divider />

            <Link
              href={'/settings/profile/delete-account-modal'}
              style={{
                color: theme.destructive,
                padding: 13,
                borderColor: theme.destructive,
                borderWidth: 1,
                borderRadius: theme.radius,
                height: 48,
                textAlign: 'center',
              }}
            >
              Delete account
            </Link>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
