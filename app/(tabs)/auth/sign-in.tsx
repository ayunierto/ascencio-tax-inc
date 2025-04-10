import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { router } from "expo-router";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/core/auth/store/useAuthStore";

import { signinSchema } from "@/core/auth/schemas/signinSchema";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Header from "@/core/auth/components/Header";
import Logo from "@/components/Logo";
import ErrorMessage from "@/core/components/ErrorMessage";
import { theme } from "@/components/ui/theme";
import TermsAndPrivacy from "@/components/TermsAndPrivacy";

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signin, setUser } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSignin = async (values: z.infer<typeof signinSchema>) => {
    setIsLoading(true);
    const response = await signin(values);
    setIsLoading(false);

    if ("token" in response) {
      router.push("/(tabs)/(home)");
      return;
    }

    if (response.message === "User is not verified") {
      setUser({
        email: values.username,
        id: "",
        name: "",
        lastName: "",
        phoneNumber: "",
        isActive: false,
        roles: [],
        createdAt: "",
      });
      router.push({ pathname: "/auth/verify", params: { action: "verify" } });
      return;
    }

    setError("root", {
      type: "manual",
      message:
        "We didn't recognize the username or password you entered. Please try again.",
    });
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
              width: "100%",
              maxWidth: 380,
              marginHorizontal: "auto",
              marginBottom: 20,
              padding: 20,
            }}
          >
            <Header
              subtitle=" Don’t have an account?"
              title={"Sign In"}
              link="/auth/sign-up"
              linkText="Sign Up"
            />
            <View style={{ gap: 10 }}>
              <ErrorMessage message={errors.root?.message} />

              <View style={{ gap: 6 }}>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      placeholder="Email or phone number"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  )}
                />
                <ErrorMessage fieldErrors={errors.username} />
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
                      secureTextEntry={true}
                      placeholder="Enter password"
                      autoComplete="password"
                      autoCapitalize="none"
                    />
                  )}
                />
                <ErrorMessage fieldErrors={errors.password} />
              </View>
            </View>
            <Text
              style={{ color: theme.primary, textAlign: "center" }}
              onPress={() => router.push("/auth/forgot-password")}
            >
              Forgot password?
            </Text>
            <Button
              loading={isLoading}
              disabled={isLoading}
              onPress={handleSubmit(onSignin)}
              focusable
            >
              Log In
            </Button>

            <TermsAndPrivacy />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;
