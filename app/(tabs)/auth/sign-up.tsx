import React from "react";

import {
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import { Controller } from "react-hook-form";
import { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

import Header from "@/core/auth/components/Header";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/Select";
import ErrorMessage from "@/core/components/ErrorMessage";
import { Button, ButtonText } from "@/components/ui/Button";
import TermsAndPrivacy from "@/components/TermsAndPrivacy";
import { useCountryCodes } from "@/core/hooks/useCountryCodes";
import { useSignUp } from "@/core/auth/hooks";
import { ServerException } from "@/core/interfaces/server-exception.response";
import { SignUpResponse } from "@/core/auth/interfaces";
import {
  SignUpApiRequest,
  SignUpRequest,
} from "@/core/auth/schemas/sign-up.schema";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/core/auth/store/useAuthStore";
import SimpleLogo from "@/components/SimpleLogo";

const SignUp = () => {
  const { countryCodes } = useCountryCodes();
  const { signUp } = useAuthStore();
  const { errors, control, callingCode, handleSubmit, setValue } = useSignUp();

  const mutation = useMutation<
    SignUpResponse,
    AxiosError<ServerException>,
    SignUpApiRequest
  >({
    mutationFn: async (data) => {
      return await signUp(data);
    },
    onSuccess: (response) => {
      router.push("/auth/verify-email");
      Toast.show({
        type: "success",
        text1: "Sign up successful",
        text2: "Please verify your email to continue.",
      });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Sign up failed",
        text1Style: { fontSize: 13 },
        text2:
          error.response?.data.message ||
          error.message ||
          "An error occurred during sign up.",
      });
    },
  });

  // Handle the sign-up
  const onSignUp = async (values: SignUpRequest): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...rest } = values;
    await mutation.mutateAsync(rest);
  };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView>
          <View
            style={{
              gap: 20,
              width: "100%",
              maxWidth: 380,
              marginHorizontal: "auto",
              padding: 20,
            }}
          >
            <View style={{ alignItems: "center", marginTop: 20 }}>
              {/* <SimpleLogo /> */}
            </View>
            <Header
              title="Sign up for Ascencio Tax"
              link={"/auth/sign-in"}
              linkText="Sign in"
              subtitle="Already have an account? "
            />

            <View style={{ gap: 10 }}>
              <ErrorMessage message={errors.root?.message} />

              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="First name"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    autoComplete="name"
                    errorMessage={errors.firstName?.message}
                    error={!!errors.firstName}
                  />
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Last name"
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
                    autoCapitalize="none"
                    autoComplete="email"
                    errorMessage={errors.email?.message}
                    error={!!errors.email}
                  />
                )}
              />

              {/* Phone Number */}
              <View>
                <View style={{ flexDirection: "row", gap: 10, flex: 1 }}>
                  <Controller
                    control={control}
                    name={"countryCode"}
                    render={({ field: { onChange, value } }) => (
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger placeholder="Select your country" />
                        <SelectContent>
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
              disabled={mutation.isPending}
              onPress={handleSubmit(onSignUp)}
            >
              <ButtonText>
                {mutation.isPending ? "Creating..." : "Create account"}
              </ButtonText>
            </Button>

            <TermsAndPrivacy />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
