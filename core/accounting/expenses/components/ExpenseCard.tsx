import React from "react";

import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ExpenseResponse } from "@/core/accounting/expenses/interfaces";
import { useExpenseCard } from "@/core/accounting/expenses/hooks/useExpenseCard";
import { Card } from "@/components/ui/Card/Card";
import { theme } from "@/components/ui/theme";
import { SimpleCardHeader } from "@/components/ui/Card/SimpleCardHeader";
import { SimpleCardHeaderTitle } from "@/components/ui/Card/SimpleCardHeaderTitle";
import { CardContent } from "@/components/ui/Card/CardContent";

interface ExpenseCardProps {
  expense: ExpenseResponse;
}

const ExpenseCard = ({ expense }: ExpenseCardProps) => {
  const { dateToLocaleDateTimeString } = useExpenseCard();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/accounting/receipts/expense/${expense.id}`)}
      style={{ marginBottom: 10 }}
    >
      <Card>
        <CardContent>
          <SimpleCardHeader>
            <Ionicons
              name={"receipt-outline"}
              size={20}
              color={theme.foreground}
            />
            <SimpleCardHeaderTitle>{expense.merchant}</SimpleCardHeaderTitle>
          </SimpleCardHeader>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Date</Text>
            <Text style={styles.metricValue}>{`${dateToLocaleDateTimeString(
              expense.date
            )}`}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Total</Text>
            <Text style={styles.metricValue}>${expense.total}</Text>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  metricItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  metricLabel: {
    color: theme.foreground,
  },
  metricValue: {
    fontWeight: "bold",
    color: theme.foreground,
  },
});

export default ExpenseCard;
