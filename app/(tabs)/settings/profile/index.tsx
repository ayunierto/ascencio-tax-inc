import React, { useState } from 'react';

import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
import { ThemedText } from '@/components/ui/ThemedText';
import ErrorMessage from '@/core/components/ErrorMessage';
import { theme } from '@/components/ui/theme';

export const profileSchema = z
  .object({
    name: z.string().min(3, 'First name must be at least 3 characters'),
    lastName: z.string().min(3, 'First name must be at least 3 characters'),
    email: z.string(),
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

  const { token, logout, user, setUser } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email,
      lastName: user?.lastName,
      name: user?.name,
      phoneNumber: user?.phoneNumber || '',
    },
  });

  if (!token) {
    return <Signin />; // Use replace to avoid stacking profile on top of sign-in
  }

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
      console.log({ response });
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
              gap: 10,
              padding: 20,
              width: '100%',
              maxWidth: 500,
              marginHorizontal: 'auto',
            }}
          >
            <ThemedText>Name</ThemedText>
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

            <ThemedText>Last Name</ThemedText>
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

            <ThemedText>Email</ThemedText>
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
                  readOnly={true}
                />
              )}
            />
            <ErrorMessage fieldErrors={errors.email} />

            <ThemedText>Phone number</ThemedText>
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  placeholder="Phone number"
                  autoCapitalize="none"
                  autoComplete="tel"
                />
              )}
            />
            <ErrorMessage fieldErrors={errors.phoneNumber} />

            <ThemedText>Password</ThemedText>
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

            <ThemedText>Confirm Password</ThemedText>
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
              onPress={handleSubmit(handleUpdateProfile)}
            >
              Update
            </Button>

            <Divider />

            <Button
              iconRight={
                <Ionicons name="log-out-outline" size={24} color="white" />
              }
              variant="outlined"
              onPress={() => logout()}
            >
              Sign out
            </Button>

            <Divider />

            <Link
              href={'/settings/profile/delete-account-modal'}
              style={{
                textAlign: 'center',
                color: theme.destructive,
                padding: 10,
                borderColor: theme.destructive,
                borderWidth: 1,
                borderRadius: theme.radius,
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                textAlignVertical: 'center',
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
