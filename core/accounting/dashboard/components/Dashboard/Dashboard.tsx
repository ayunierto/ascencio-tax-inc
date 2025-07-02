import React, { useState, useEffect, useCallback } from 'react';

import { View, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { getExpenses } from '@/core/accounting/expenses/actions';
import { getLogs } from '@/core/logs/actions';
import { Expense } from '@/core/accounting/expenses/interfaces';
import { Metrics } from './Metrics';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';
import Loader from '@/components/Loader';
import { useRevenueCat } from '@/providers/RevenueCat';
import { goPro } from '@/core/accounting/actions';
import Toast from 'react-native-toast-message';
import { EmptyList } from '@/core/components';

const ReceiptsDashboard = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const { isPro } = useRevenueCat();

  const { data: expenses, isPending: isLoadingExpenses } = useQuery({
    queryKey: ['totalExpenses'],
    queryFn: () => getExpenses(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const {
    data: logs,
    refetch: refreshLogs,
    isPending: isLoadingLogs,
  } = useQuery({
    queryKey: ['logs'],
    queryFn: () => getLogs(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useFocusEffect(
    useCallback(() => {
      // ComponentDidMount logic (if any) can go here
      refreshLogs(); // Refetch logs when the component is focused
    }, [])
  );

  useEffect(() => {
    if (expenses && !('error' in expenses)) {
      if (expenses.length > 0) {
        const total = expenses.reduce(
          (acc: number, receipt: Expense) => acc + +receipt.total,
          0
        );
        setTotalExpenses(total);
      }
    }
  }, [expenses]);

  if (isLoadingExpenses || isLoadingLogs) return <Loader />;

  if (!logs) {
    return (
      <EmptyList
        title="Error"
        subtitle="An unexpected error occurred while fetching the recent activity. Please try again later."
      />
    );
  }

  if (!expenses) {
    return (
      <EmptyList
        title="Error"
        subtitle="An unexpected error occurred while fetching the expenses."
      />
    );
  }

  if ('error' in expenses) {
    return <EmptyList title="Error" subtitle={expenses.message} />;
  }

  if ('error' in logs) {
    return <EmptyList title="Error" subtitle={logs.message} />;
  }

  const getReport = () => {
    if (expenses.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'Info',
        text2: 'No expenses to generate report',
      });
      return;
    }
    router.push('/(tabs)/accounting/reports');
  };

  const keyMetrics = [
    // { label: 'Total Income', value: '$12,000' },
    // { label: 'Today', value: `$${totalExpenses}` },
    // { label: 'This Week', value: `$${totalExpenses}` },
    // { label: 'This month', value: `$${totalExpenses}` },
    { label: 'Total Expenses', value: `$${totalExpenses}` },
    // { label: 'Net Profit', value: '$4,000' },
  ];

  const quickActions = [
    {
      label: 'Add Expense',
      onPress: () => addExpense(),
    },
    {
      label: 'Scan Expense',
      onPress: () => scanExpense(),
    },
    // { label: 'Add Income', onPress: () => addIncome('Add Income') },
    { label: 'View Reports', onPress: () => viewReport() },
  ];

  const addExpense = () => {
    if (!isPro && expenses.length >= 5) {
      goPro();
    } else {
      router.push('/(tabs)/accounting/receipts/expense/create');
    }
  };

  const scanExpense = () => {
    if (!isPro && expenses.length >= 5) {
      goPro();
    } else {
      router.push('/scan-receipts');
    }
  };

  const viewReport = () => {
    getReport();
  };

  // const recentActivity = [
  //   { description: 'Expense added: Office Supplies', date: '2024-07-15' },
  //   { description: 'Income received: Client Payment', date: '2024-07-14' },
  //   { description: 'Report generated: Monthly Summary', date: '2024-07-13' },
  // ];

  return (
    <View style={styles.container}>
      <Metrics metrics={keyMetrics} />

      <QuickActions actions={quickActions} />

      <RecentActivity loading={isLoadingLogs} activities={logs} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
});

export default ReceiptsDashboard;
