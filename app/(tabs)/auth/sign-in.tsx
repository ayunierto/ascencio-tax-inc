import React from "react";
import { View, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";

import { Controller } from "react-hook-form";

import { Button, ButtonText } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Header from "@/core/auth/components/Header";
import ErrorMessage from "@/core/components/ErrorMessage";
import { theme } from "@/components/ui/theme";
import TermsAndPrivacy from "@/components/TermsAndPrivacy";
import { ThemedText } from "@/components/ui/ThemedText";
import { useSignIn } from "@/core/auth/hooks";
import SimpleLogo from "@/components/SimpleLogo";

const SignInScreen = () => {
  const { control, handleSubmit, formErrors, isPending, handleSignIn } = useSignIn();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView>
          <View
            style={{
              flex: 1,
              gap: 20,
              width: "100%",
              maxWidth: 380,
              marginHorizontal: "auto",
              marginBottom: 20,
              padding: 20,
            }}
          >
            <View
              style={{
                marginTop: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SimpleLogo />
            </View>

            <Header
              title={"Sign in to Ascencio Tax"}
              subtitle=" Don’t have an account?"
              link="/auth/sign-up"
              linkText="Sign Up"
            />
            <View style={{ gap: 14 }}>
              <ErrorMessage message={formErrors.root?.message} />

              <View style={{ gap: 10 }}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      leadingIcon="at-outline"
                      label="Email"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      error={!!formErrors.email}
                      errorMessage={formErrors.email?.message}
                    />
                  )}
                />
              </View>

              <View style={{ gap: 6 }}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      leadingIcon="lock-closed-outline"
                      label="Password"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      secureTextEntry={true}
                      autoComplete="password"
                      autoCapitalize="none"
                      error={!!formErrors.password}
                      errorMessage={formErrors.password?.message}
                    />
                  )}
                />
              </View>
            </View>

            <ThemedText
              style={{
                color: theme.primary,
                textAlign: "center",
                textDecorationLine: "underline",
              }}
              onPress={() => !isPending && router.push("/auth/forgot-password")}
            >
              Forgot password?
            </ThemedText>

            <Button disabled={isPending} onPress={handleSubmit(handleSignIn)}>
              <ButtonText>{isPending ? "Signing in..." : "Sign in"}</ButtonText>
            </Button>

            <TermsAndPrivacy />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
