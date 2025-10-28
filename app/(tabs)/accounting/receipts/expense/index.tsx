import React, { useLayoutEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useExpenses } from '@/core/accounting/expenses/hooks/useExpenses';
import ExpensesList from '@/core/accounting/expenses/components/ExpensesList';
import Loader from '@/components/Loader';
import { Fab } from '@/core/accounting/components';
import { useRevenueCat } from '@/providers/RevenueCat';
import { goPro } from '@/core/accounting/actions';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { theme } from '@/components/ui/theme';

const ExpensesScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    // This sets the title for the parent Stack (the Drawer)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drawer = navigation.getParent() as DrawerNavigationProp<any>;
    if (drawer) {
      drawer.setOptions({
        title: 'Expenses',
        headerLeft: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => drawer.openDrawer()}
              style={{ marginRight: 15 }}
            >
              <MaterialCommunityIcons
                name="menu"
                size={24}
                color={theme.foreground}
              />
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => null,
      });
    }
  }, [navigation]);

  const { expensesQuery, loadNextPage } = useExpenses();
  const { isPro } = useRevenueCat();

  if (expensesQuery.isLoading) {
    return <Loader message="Loading expenses..." />;
  }

  return (
    <View style={{ flex: 1, marginHorizontal: 10 }}>
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
                router.push('/(tabs)/accounting/receipts/expense/new');
              }
            },
          },
          {
            icon: <Ionicons name="camera-outline" size={20} color="white" />,
            onPress: () => {
              if (!isPro) {
                goPro();
              } else {
                router.push({
                  pathname: '/scan-receipts',
                  params: { id: 'scan-receipt' },
                });
              }
            },
          },
        ]}
      />
    </View>
  );
};

export default ExpensesScreen;
