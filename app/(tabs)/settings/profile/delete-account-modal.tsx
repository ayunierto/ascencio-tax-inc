import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuthStore } from '@/core/auth/store/useAuthStore';
import Button from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/components/ui/theme';
import { Input } from '@/components/ui/Input';
import { ThemedText } from '@/components/ui/ThemedText';
import ErrorMessage from '@/core/components/ErrorMessage';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

export const deleteAccountSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6),
});

const DeleteAccountModal = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const { deleteAccount, user } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof deleteAccountSchema>>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const onDeleteAccount = async ({
    email,
    password,
  }: z.infer<typeof deleteAccountSchema>) => {
    if (user && user.email === email) {
      setIsDeleting(true);
      const response = await deleteAccount({ password });
      setIsDeleting(false);
      if ('error' in response) {
        setError('root', { message: response.message });
        return;
      }

      Toast.show({
        text1: response.message,
        text2: 'We hope to see you again soon.',
      });
      router.replace('/auth/sign-in');
      return;
    }

    setError('email', {
      type: 'validate',
      message: 'The email entered does not match the registered one.',
    });
    setIsDeleting(false);
  };

  return (
    <View style={{ padding: 20, gap: 10, flex: 1 }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 24,
          color: 'orange',
          fontWeight: 'bold',
        }}
      >
        Warning!!!
      </Text>
      <ThemedText style={{ fontSize: 16 }}>
        Deleting your account will permanently erase all your data and access to
        associated services. To confirm deletion, please enter your email
        address. Are you sure you wish to proceed?.
      </ThemedText>
      <ThemedText style={{ color: theme.muted }}>
        Email: {user && user.email}
      </ThemedText>

      {errors.root && <ErrorMessage message={errors.root.message} />}

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
            autoComplete="off"
          />
        )}
      />
      <ErrorMessage fieldErrors={errors.email} />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="default"
            placeholder="Password"
            autoCapitalize="none"
            autoComplete="off"
          />
        )}
      />
      <ErrorMessage fieldErrors={errors.password} />

      <Button
        iconLeft={
          <Ionicons name="trash-outline" color={theme.foreground} size={24} />
        }
        loading={isDeleting}
        disabled={isDeleting}
        onPress={handleSubmit(onDeleteAccount)}
        variant="destructive"
      >
        Delete Account
      </Button>
    </View>
  );
};

export default DeleteAccountModal;
