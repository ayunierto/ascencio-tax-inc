import React from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";

import Loader from "@/components/Loader";
import { useExpense } from "@/core/accounting/expenses/hooks/useExpense";
import { EmptyContent } from "@/core/components";
import ExpenseForm from "@/components/accounting/expenses/ExpenseForm";
import { router, useLocalSearchParams } from "expo-router";

const ExpenseScreen = () => {
  const { id } = useLocalSearchParams();
  console.warn({ id });
  const {
    data: expense,
    isLoading,
    isError,
    error,
  } = useExpense((id as string) || "new");

  if (isError) {
    return (
      <EmptyContent
        title="Error"
        subtitle={error.response?.data.message || error.message}
      />
    );
  }

  if (isLoading) return <Loader />;
  if (!expense) {
    router.replace("/(tabs)/(home)");
    return null;
  }

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView>
        <ExpenseForm expense={expense} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ExpenseScreen;
