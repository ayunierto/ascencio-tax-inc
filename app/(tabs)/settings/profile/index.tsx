import React, { useEffect, useState } from 'react';

import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Signin from '../../auth/sign-in';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Divider from '@/components/ui/Divider';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import ErrorMessage from '@/core/components/ErrorMessage';
import { theme } from '@/components/ui/theme';
import { useCountryCodes } from '@/core/hooks/useCountryCodes';
import Select from '@/components/ui/Select';
import useIPGeolocation from '@/core/hooks/useIPGeolocation';
import {
  ProfileFormValues,
  profileSchema,
} from '@/core/user/schemas/updateProfileSchema';
import { useUpdateProfileMutation } from '@/core/user/hooks/useUpdateProfileMutation';

const ProfileScreen = () => {
  const { user } = useAuthStore();
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
    setValue,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      countryCode: user.countryCode || callingCode || '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();
  const handleUpdateProfile = async (values: ProfileFormValues) => {
    updateProfile(values);
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
              name="firstName"
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
            <ErrorMessage fieldErrors={errors.firstName} />

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
                      rootStyle={{ flex: 2 }}
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
              loading={isPending}
              disabled={isPending}
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
