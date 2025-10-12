import React, { useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { useAuthStore } from "@/core/auth/store/useAuthStore";

import { useTimer } from "@/core/auth/hooks/useTimer";
import Header from "@/core/auth/components/Header";
import { Input } from "@/components/ui/Input";
import { Button, ButtonText } from "@/components/ui/Button";
import ErrorMessage from "@/core/components/ErrorMessage";
import { useVerifyEmailMutation } from "@/core/auth/hooks/useVerifyEmailMutation";
import { useResendEmailCodeMutation } from "@/core/auth/hooks/useResendEmailCodeMutation";
import {
  VerifyCodeRequest,
  verifyCodeSchema,
} from "@/core/auth/schemas/verify-email-code.schema";
import { EmptyContent } from "@/core/components";

const VerifyEmail = () => {
  const { tempEmail } = useAuthStore();
  const { timeRemaining, isRunning, startTimer, resetTimer } = useTimer(30); // 60 seconds countdown

  useEffect(() => {
    startTimer();

    return () => {
      resetTimer();
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<VerifyCodeRequest>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      email: tempEmail || "",
      code: "",
    },
  });

  // Handle email verification
  const { mutateAsync: verifyEmail, isPending } = useVerifyEmailMutation();
  const handleEmailVerification = async (data: VerifyCodeRequest) => {
    await verifyEmail(data, {
      onSuccess: () => {
        resetTimer();
      },
      onError: () => {
        resetTimer();
        startTimer();
        resetField("code");
      },
    });
  };

  const { mutate: resendEmailCode, isPending: isLoadingResend } =
    useResendEmailCodeMutation();

  const handleResendVerificationCode = async () => {
    if (tempEmail) {
      if (isRunning) return;
      resendEmailCode(tempEmail);

      resetTimer();
      startTimer();
    }
  };

  if (!tempEmail) {
    return (
      <SafeAreaView>
        <EmptyContent
          title="Email not found"
          subtitle="Temporary email not found"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView behavior="padding">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                gap: 30,
                maxWidth: 320,
                marginHorizontal: "auto",
              }}
            >
              <Header
                title={"Verify email"}
                subtitle={
                  "Please check your email for a message with your code. Your code is 6 numbers long."
                }
              />

              <View style={{ gap: 10 }}>
                <Controller
                  control={control}
                  name="code"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Code"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect={false}
                      maxLength={6}
                      error={!!errors.code}
                      errorMessage={errors.code?.message}
                    />
                  )}
                />
                <ErrorMessage fieldErrors={errors.email} />

                <Button
                  disabled={isPending}
                  onPress={handleSubmit(handleEmailVerification)}
                >
                  <ButtonText>
                    {isPending ? "Verifying...  " : "Verify"}
                  </ButtonText>
                </Button>

                <Button
                  disabled={isLoadingResend || isRunning}
                  onPress={handleResendVerificationCode}
                  variant="outline"
                >
                  <ButtonText>
                    {timeRemaining === 0
                      ? "Resend code"
                      : `Resend in ${timeRemaining}s`}
                  </ButtonText>
                </Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyEmail;
