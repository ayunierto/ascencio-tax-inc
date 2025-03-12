import React from 'react';
import { View } from 'react-native';

import { FAB } from '@/core/accounting/components';
import { useExpenses } from '@/core/accounting/expenses/hooks/useExpenses';
import ExpensesList from '@/core/accounting/expenses/components/ExpensesList';
import { EmptyList } from '@/core/components';
import Loader from '@/components/Loader';

const ExpensesScreen = () => {
  const { expensesQuery, loadNextPage } = useExpenses();

  if (expensesQuery.isLoading) {
    return <Loader />;
  }

  if (expensesQuery.data?.pages[0].length === 0) {
    return (
      <>
        <EmptyList
          title="No expenses found."
          subtitle="Add a new expense to get started"
        />

        <FAB />
      </>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ExpensesList
        expenses={expensesQuery.data?.pages.flatMap((page) => page) ?? []}
        loadNextPage={loadNextPage}
      />
      <FAB />
    </View>
  );
};

export default ExpensesScreen;
