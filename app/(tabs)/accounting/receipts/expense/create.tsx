import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
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

const CreateExpenseScreen = () => {
  const {
    accountQuery,
    categoryOptions,
    subcategoryOptions,
    onChangeCategory,
    onSubmit,
    control,
    handleSubmit,
    setValue,
    errors,
    isFetching,
    selectedImages,
    selectedSubcategory,
    subcategoryQuery,
    categoryQuery,
    watch,
    navigation,
  } = useCreateExpense();

  useEffect(() => {
    const merchant = watch('merchant') || '';
    navigation.setOptions({
      title: merchant.length === 0 ? 'New' : merchant,
      headerRight: ({ tintColor }: { tintColor: string }) =>
        isFetching ? (
          <ActivityIndicator color={theme.foreground} />
        ) : (
          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <Ionicons name="save-outline" color={tintColor} size={24} />
          </TouchableOpacity>
        ),
    });
  }, [watch('merchant'), isFetching]);

  if (
    accountQuery.isPending ||
    subcategoryQuery.isPending ||
    categoryQuery.isPending
  ) {
    return <Loader />;
  }

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView>
        <View style={{ margin: 20, gap: 10 }}>
          <ThemedText>Receipt image:</ThemedText>
          <ExpenseImage
            onChange={(image) => setValue('image', image)}
            image={selectedImages.length > 0 ? selectedImages[0].uri : null}
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
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="number-pad"
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
                value={value}
                onBlur={onBlur}
                keyboardType="number-pad"
                onChangeText={onChange}
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
                  accountQuery.data?.map((account: Account) => ({
                    label: account.name,
                    value: account.id.toString(),
                  })) ?? []
                }
                placeholder="Account"
                onChange={onChange}
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
                  onChangeCategory(id);
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
                style={{ height: 'auto', minHeight: 48 }}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <ErrorMessage fieldErrors={errors.notes} />

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={isFetching}
            disabled={isFetching}
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
