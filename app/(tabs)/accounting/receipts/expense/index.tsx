import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useExpenses } from "@/core/accounting/expenses/hooks/useExpenses";
import ExpensesList from "@/core/accounting/expenses/components/ExpensesList";
import Loader from "@/components/Loader";
import { Fab } from "@/core/accounting/components";
import { useRevenueCat } from "@/providers/RevenueCat";
import { goPro } from "@/core/accounting/actions";

const ExpensesScreen = () => {
  const { expensesQuery, loadNextPage } = useExpenses();
  const { isPro } = useRevenueCat();

  if (expensesQuery.isLoading) {
    return <Loader message="Loading expenses..." />;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ExpensesList
        expenses={expensesQuery.data?.pages.flatMap((page) => page) ?? []}
        loadNextPage={loadNextPage}
      />

      <Fab
        actions={[
          {
            icon: <Ionicons name="receipt-outline" size={20} color="white" />,
            onPress: () => {
              if (!isPro) {
                goPro();
              } else {
                router.push("/(tabs)/accounting/receipts/expense/new");
              }
            },
          },
          {
            icon: <Ionicons name="camera-outline" size={20} color="white" />,
            onPress: () => {
              if (!isPro) {
                goPro();
              } else {
                router.push("/scan-receipts");
              }
            },
          },
        ]}
      />
    </View>
  );
};

export default ExpensesScreen;
