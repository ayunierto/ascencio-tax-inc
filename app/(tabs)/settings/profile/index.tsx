import React, { useEffect, useState } from 'react';

import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Signin from '../../auth/sign-in';
import { Input } from '@/components/ui/Input';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import Divider from '@/components/ui/Divider';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { theme } from '@/components/ui/theme';
import { useCountryCodes } from '@/core/hooks/useCountryCodes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/Select';
import useIPGeolocation from '@/core/hooks/useIPGeolocation';
import { useUpdateProfileMutation } from '@/core/user/hooks/useUpdateProfileMutation';
import {
  UpdateProfileRequest,
  updateProfileSchema,
} from '@/core/auth/schemas/update-profile.schema';

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
  } = useForm<UpdateProfileRequest>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      countryCode: user.countryCode || callingCode || '',
    },
  });

  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();
  const handleUpdateProfile = async (values: UpdateProfileRequest) => {
    updateProfile(values);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView behavior="padding">
          <View
            style={{
              flex: 1,
              padding: 20,
              width: '100%',
              maxWidth: 500,
              marginHorizontal: 'auto',
              gap: 10,
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
                  error={!!errors.firstName}
                  errorMessage={errors.firstName?.message || ''}
                />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Last Name"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  autoCapitalize="words"
                  autoComplete="name-family"
                  error={!!errors.lastName}
                  errorMessage={errors.lastName?.message || ''}
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
                  readOnly={true}
                  error={!!errors.email}
                  errorMessage={errors.email?.message || ''}
                />
              )}
            />

            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', gap: 10, flex: 1 }}>
                <Controller
                  control={control}
                  name={'countryCode'}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      value={value}
                      onValueChange={onChange}
                      error={!!errors.countryCode}
                      errorMessage={errors.countryCode?.message}
                    >
                      <SelectTrigger
                        placeholder="Select a category"
                        labelText="Category"
                      />
                      <SelectContent>
                        <ScrollView>
                          <FlatList
                            data={countryCodes}
                            keyExtractor={(item) => item.value + item.label}
                            renderItem={({ item: opt }) => (
                              <SelectItem
                                key={opt.value + opt.label}
                                label={opt.label}
                                value={opt.value}
                              />
                            )}
                          />
                        </ScrollView>
                      </SelectContent>
                    </Select>
                  )}
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
                  autoComplete="password-new"
                  error={!!errors.password}
                  errorMessage={errors.password?.message || ''}
                />
              )}
            />

            <View style={{ marginTop: 10, gap: 10 }}>
              <Button
                disabled={isPending}
                onPress={handleSubmit(handleUpdateProfile)}
              >
                <ButtonText>{isPending ? 'Updating...' : 'Update'}</ButtonText>
                <ButtonIcon name="save-outline" />
              </Button>

              <Divider />

              <Link
                href={'/settings/profile/delete-account-modal'}
                style={styles.deleteButton}
              >
                Delete account
              </Link>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    color: theme.destructive,
    padding: 13,
    borderColor: theme.destructive,
    borderWidth: 1,
    borderRadius: theme.radius,
    height: 48,
    textAlign: 'center',
  },
});

export default ProfileScreen;
