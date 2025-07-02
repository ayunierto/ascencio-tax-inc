import React from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Controller } from 'react-hook-form';

import { Account } from '@/core/accounting/accounts/interfaces';
import ExpenseImage from '@/core/accounting/expenses/components/ExpenseImage';
import ErrorMessage from '@/core/components/ErrorMessage';
import { useCreateExpense } from '@/core/accounting/expenses/hooks';
import Loader from '@/components/Loader';
import { ThemedText } from '@/components/ui/ThemedText';
import { Input } from '@/components/ui/Input';
import { theme } from '@/components/ui/theme';
import DateTimePicker from '@/components/ui/DateTimePicker/DateTimePicker';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { EmptyList } from '@/core/components';

const CreateExpenseScreen = () => {
  const {
    accounts,
    categories,
    categoryOptions,
    subcategories,
    subcategoryOptions,
    handleChangeCategory,
    handleCreateExpense,
    control,
    handleSubmit,
    setValue,
    errors,
    isSavingExpense,
    selectedImage,
    selectedSubcategory,
    isAccountsLoading,
    isCategoriesLoading,
    isSubcategoriesLoading,
  } = useCreateExpense();

  if (isAccountsLoading || isCategoriesLoading || isSubcategoriesLoading) {
    return <Loader />;
  }

  if (!accounts || !categories || !subcategories) {
    return (
      <EmptyList
        title="Error"
        subtitle="An unexpected error occurred while fetching data. Please try again later."
      />
    );
  }

  if (
    'error' in accounts ||
    'error' in categories ||
    'error' in subcategories
  ) {
    return (
      <EmptyList
        title="Error"
        subtitle="An unexpected error occurred while fetching data. Please try again later."
      />
    );
  }

  if (accounts.length === 0) {
    return (
      <EmptyList
        title="No accounts found"
        subtitle="Please create an account first."
      />
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyList
        title="No categories found"
        subtitle="Please create a category first."
      />
    );
  }

  if (subcategories.length === 0) {
    return (
      <EmptyList
        title="No subcategories found"
        subtitle="Please create a subcategory first."
      />
    );
  }

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView>
        <View style={{ margin: 20, gap: 10 }}>
          <ThemedText>Receipt image:</ThemedText>
          <ExpenseImage
            onChange={(image) => setValue('image', image)}
            image={selectedImage && selectedImage.uri}
          />

          <ThemedText>Merchant:</ThemedText>
          <Controller
            control={control}
            name={'merchant'}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Merchant"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <ErrorMessage fieldErrors={errors.merchant} />

          <ThemedText>Date:</ThemedText>
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <DateTimePicker value={value} onChange={onChange} />
            )}
          />
          <ErrorMessage fieldErrors={errors.date} />

          <ThemedText>Total:</ThemedText>
          <Controller
            control={control}
            name="total"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Total"
                // value={value}
                onBlur={onBlur}
                // onChangeText={onChange}
                keyboardType="number-pad"
                onChangeText={(text) => {
                  // Convert the text to a number.
                  // If it's empty, set it to undefined. If it's not a number, set it to NaN.
                  // Zod will validate this as 'number' or throw an 'invalid_type_error'.
                  const numericValue = text === '' ? undefined : Number(text);
                  onChange(numericValue);
                }}
                // We need to convert the value to a string for the TextInput
                // because TextInput expects a string value.
                value={value != null ? String(value) : ''}
              />
            )}
          />
          <ErrorMessage fieldErrors={errors.total} />

          <ThemedText>Tax:</ThemedText>
          <Controller
            control={control}
            name="tax"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Tax"
                value={value != null ? String(value) : ''}
                onBlur={onBlur}
                keyboardType="number-pad"
                onChangeText={(text) => {
                  // Convert the text to a number.
                  // If it's empty, set it to undefined. If it's not a number, set it to NaN.
                  // Zod will validate this as 'number' or throw an 'invalid_type_error'.
                  const numericValue = text === '' ? undefined : Number(text);
                  onChange(numericValue);
                }}
              />
            )}
          />
          <ErrorMessage fieldErrors={errors.tax} />

          <ThemedText>Account:</ThemedText>
          <Controller
            control={control}
            name="accountId"
            render={({ field: { onChange } }) => (
              <Select
                enableFilter={false}
                options={
                  accounts.map((account: Account) => ({
                    label: account.name,
                    value: account.id,
                  })) ?? []
                }
                placeholder="Account"
                onChange={onChange}
                selectedOptions={{
                  label: accounts[0].name,
                  value: accounts[0].id,
                }}
              />
            )}
          />
          <ErrorMessage fieldErrors={errors.accountId} />

          <ThemedText>Category:</ThemedText>
          <Controller
            control={control}
            name="categoryId"
            render={() => (
              <Select
                enableFilter={false}
                options={categoryOptions}
                placeholder="Category"
                onChange={(id) => {
                  handleChangeCategory(id);
                }}
              />
            )}
          />
          <ErrorMessage fieldErrors={errors.categoryId} />

          {subcategoryOptions.length > 0 && (
            <>
              <ThemedText>Subcategory:</ThemedText>
              <Controller
                control={control}
                name="subcategoryId"
                render={() => (
                  <Select
                    enableFilter={false}
                    options={subcategoryOptions}
                    placeholder="Subcategory"
                    selectedOptions={selectedSubcategory}
                    onChange={(id) => setValue('subcategoryId', id)}
                  />
                )}
              />
              <ErrorMessage fieldErrors={errors.subcategoryId} />
            </>
          )}

          <ThemedText>Notes:</ThemedText>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Notes"
                multiline
                numberOfLines={5}
                style={{ minHeight: 48, paddingVertical: 15 }}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <ErrorMessage fieldErrors={errors.notes} />

          <Button
            onPress={handleSubmit(handleCreateExpense)}
            loading={isSavingExpense}
            disabled={isSavingExpense}
            iconRight={
              <Ionicons
                name="save-outline"
                size={24}
                color={theme.foreground}
              />
            }
          >
            Save
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateExpenseScreen;
