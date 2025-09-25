import React from "react";
import { View } from "react-native";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/core/auth/store/useAuthStore";
import Button from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/components/ui/theme";
import { Input } from "@/components/ui/Input";
import { ThemedText } from "@/components/ui/ThemedText";
import ErrorMessage from "@/core/components/ErrorMessage";
import { useDeleteAccountMutation } from "@/core/auth/hooks";
import {
  DeleteAccountRequest,
  deleteAccountSchema,
} from "@/core/auth/schemas/delete-account.schema";

const DeleteAccountModal = () => {
  const { user } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountRequest>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const { mutate: deleteAccount, isPending } = useDeleteAccountMutation();

  const handleAccountDeletion = async ({ password }: DeleteAccountRequest) => {
    deleteAccount({ password });
  };

  return (
    <View style={{ padding: 20, gap: 10, flex: 1 }}>
      <View style={{ alignItems: "center", marginBottom: 8 }}>
        <Ionicons name="warning-outline" size={32} color={theme.destructive} />
        <ThemedText
          style={{
            textAlign: "center",
            fontSize: 22,
            color: theme.destructive,
            fontWeight: "bold",
            marginTop: 4,
          }}
        >
          Warning!
        </ThemedText>
      </View>
      <ThemedText style={{ fontSize: 16 }}>
        Deleting your account will permanently erase all your data and access to
        associated services. To confirm deletion, please enter your email
        address and password. Are you sure you wish to proceed?.
      </ThemedText>
      <ThemedText style={{ color: theme.muted }}>
        Email: {user && user.email}
      </ThemedText>

      {errors.root && <ErrorMessage message={errors.root.message} />}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Password"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="default"
            placeholder="Password"
            autoCapitalize="none"
            autoComplete="off"
            error={!!errors.password}
            errorMessage={errors.password?.message}
          />
        )}
      />

      <Button
        iconLeft={
          <Ionicons name="trash-outline" color={theme.foreground} size={24} />
        }
        loading={isPending}
        disabled={isPending}
        onPress={handleSubmit(handleAccountDeletion)}
        variant="destructive"
      >
        Delete Account
      </Button>
    </View>
  );
};

export default DeleteAccountModal;
