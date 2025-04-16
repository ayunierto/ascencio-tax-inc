import React, { useState, useEffect, useCallback } from 'react';

import { View, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

import { getExpenses } from '@/core/accounting/expenses/actions';
import { getLogs } from '@/core/logs/actions';
import { Expense } from '@/core/accounting/expenses/interfaces';
import { Log } from '@/core/logs/interfaces';
import { Metrics } from './Metrics';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';
import Loader from '@/components/Loader';
import { useRevenueCat } from '@/providers/RevenueCat';
import { goPro } from '@/core/accounting/actions';
import Toast from 'react-native-toast-message';

const ReceiptsDashboard = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [recentActivity, setRecentActivity] = useState<Log[]>([]);
  const { isPro } = useRevenueCat();

  const expenseQuery = useQuery({
    queryKey: ['totalExpenses'],
    queryFn: () => getExpenses(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const logsQuery = useQuery({
    queryKey: ['logs'],
    queryFn: () => getLogs(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useFocusEffect(
    useCallback(() => {
      // ComponentDidMount logic (if any) can go here
      logsQuery.refetch(); // Refetch logs when the component is focused
    }, [])
  );

  useEffect(() => {
    if (logsQuery.data) {
      setRecentActivity(logsQuery.data);
    }
  }, [logsQuery.data]);

  useEffect(() => {
    if (expenseQuery.data) {
      if (expenseQuery.data.length > 0) {
        const total = expenseQuery.data.reduce(
          (acc: number, receipt: Expense) => acc + +receipt.total,
          0
        );
        setTotalExpenses(total);
      }
    }
  }, [expenseQuery.data]);

  if (expenseQuery.isLoading) return <Loader />;

  if (!expenseQuery.data) {
    setTotalExpenses(0);
    return;
  }

  const getReport = () => {
    if (expenseQuery.data.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'Info',
        text1Style: { fontSize: 14 },
        text2: 'No expenses to generate report',
        text2Style: { fontSize: 12 },
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
    if (!isPro && expenseQuery.data.length >= 5) {
      goPro();
    } else {
      router.push('/(tabs)/accounting/receipts/expense/create');
    }
  };

  const scanExpense = () => {
    if (!isPro && expenseQuery.data.length >= 5) {
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

      <RecentActivity
        loading={logsQuery.isRefetching}
        activities={recentActivity}
      />
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
