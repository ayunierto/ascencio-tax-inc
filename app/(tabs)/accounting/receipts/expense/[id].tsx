import React, { useCallback, useLayoutEffect } from 'react';
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { TouchableOpacity, View } from 'react-native';

import Loader from '@/components/Loader';
import { useExpense } from '@/core/accounting/expenses/hooks/useExpense';
import { EmptyContent } from '@/core/components';
import ExpenseForm from '@/core/accounting/expenses/components/ExpenseForm/ExpenseForm';
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { theme } from '@/components/ui/theme';
import { useExpenseStore } from '@/core/accounting/expenses/store/useExpenseStore';
import { useCategories } from '@/core/accounting/categories/hooks/useCategories';

const ExpenseScreen = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const {
    imageUrl,
    merchant,
    date,
    total,
    tax,
    categoryId,
    subcategoryId,
    reset,
    removeImage,
  } = useExpenseStore();

  const {
    data: expense,
    isLoading,
    isError,
    error,
    refetch,
  } = useExpense((id as string) || 'new');
  const {
    data: categories,
    isError: isErrorCategories,
    error: errorCategories,
    isLoading: isLoadingCategories,
  } = useCategories();

  useLayoutEffect(() => {
    // This is to customize the header with drawer and back button
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drawer = navigation.getParent() as DrawerNavigationProp<any>;
    if (drawer) {
      drawer.setOptions({
        title: id === 'new' ? 'Add expense' : 'Edit expense',
        // headerShown: false,
        headerLeft: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
            }}
          >
            {/* Button to open the Drawer */}
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

            {/* Button to go back */}
            <TouchableOpacity
              onPress={() =>
                router.replace('/(tabs)/accounting/receipts/expense')
              }
            >
              <AntDesign name="arrowleft" size={24} color={theme.foreground} />
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => {
          if (id === 'new') {
            return null;
          }
          return (
            <TouchableOpacity onPress={() => {}} style={{ marginRight: 10 }}>
              <Ionicons
                name="trash-outline"
                size={24}
                color={theme.destructive}
              />
            </TouchableOpacity>
          );
        },
      });
    }
  }, [navigation]);

  // Handle cleanup when screen is unfocused
  useFocusEffect(
    useCallback(() => {
      // Screen focused
      refetch();
      return () => {
        // Handle cleanup on screen unfocus
        // Remove uploaded image from cloudinary if any
        // and clear the store
        if (id !== 'new') {
          removeImage();
        }

        reset();
      };
    }, [imageUrl])
  );

  if (isError) {
    return (
      <EmptyContent
        title="Error"
        subtitle={error.response?.data.message || error.message}
        icon="sad-outline"
      />
    );
  }

  if (isLoading) return <Loader message="Loading expense..." />;
  if (!expense) {
    // Redirect if expense not found
    router.replace('/(tabs)/(home)');
    return null;
  }

  if (isErrorCategories) {
    return (
      <EmptyContent
        title="Error"
        subtitle={
          errorCategories.response?.data.message || errorCategories.message
        }
        icon="sad-outline"
      />
    );
  }
  if (isLoadingCategories) {
    return <Loader message="Loading categories..." />;
  }
  if (!categories || categories.length === 0) {
    return (
      <EmptyContent
        title="Info"
        subtitle="No categories available. Please contact support."
        icon="information-circle-outline"
      />
    );
  }

  return (
    <ExpenseForm
      expense={{
        ...expense,
        // Override with scanned details if available
        imageUrl: imageUrl || expense.imageUrl,
        merchant: merchant || expense.merchant,
        date: date || expense.date,
        total: total || expense.total,
        tax: tax || expense.tax,
        category:
          categories.find((cat) => cat.id === categoryId) || expense.category,
        subcategory:
          categories
            .find((cat) => cat.id === categoryId)
            ?.subcategories.find((sub) => sub.id === subcategoryId) ||
          expense.subcategory,
        notes: expense.notes,
      }}
      categories={categories}
    />
  );
};

export default ExpenseScreen;
