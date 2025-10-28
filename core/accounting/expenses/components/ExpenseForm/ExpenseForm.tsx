import { View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import {
  ExpenseFormFields,
  expenseSchema,
} from '@/core/accounting/expenses/schemas';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { ExpenseResponse } from '@/core/accounting/expenses/interfaces';
import { Input } from '@/components/ui/Input';
import DateTimePicker from '@/components/ui/DateTimePicker/DateTimePicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/Select';

import { Subcategory } from '@/core/accounting/subcategories/interfaces';
import { useExpenseMutation } from '@/core/accounting/expenses/hooks/useExpenseMutation';
import ExpenseImage from '@/core/accounting/expenses/components/ExpenseImage';
import { Category } from '@/core/accounting/categories/interfaces/category.interface';
import ErrorMessage from '@/core/components/ErrorMessage';

interface ExpenseFormProps {
  expense: ExpenseResponse;
  categories: Category[];
}

export default function ExpenseForm({ expense, categories }: ExpenseFormProps) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>(
    categories.find((cat) => cat.id === expense.category?.id)?.subcategories ||
      []
  );
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ExpenseFormFields>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      ...expense,
      imageUrl: expense.imageUrl || undefined,
      notes: expense.notes || undefined,
      categoryId: expense.category?.id || undefined,
      subcategoryId: expense.subcategory?.id || undefined,
    },
  });

  const expenseMutation = useExpenseMutation();

  const onSubmit = async (values: ExpenseFormFields) => {
    console.warn(values);

    await expenseMutation.mutateAsync(values, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'Expense created',
        });
        reset();
        router.replace('/(tabs)/accounting/receipts/expense');
      },
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1: error.response?.data.message || error.message,
        });
      },
    });
  };

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView>
        <View style={{ margin: 10, gap: 20 }}>
          <Controller
            control={control}
            name="imageUrl"
            render={({ field: { onChange, value } }) => (
              <ExpenseImage
                onChange={(image) => {
                  onChange(null);
                  setValue('imageUrl', image);
                }}
                imageUrl={value}
                expenseId={expense.id}
              />
            )}
          />
          {errors.id && <ErrorMessage message={errors.id.message} />}
          {errors.imageUrl && (
            <ErrorMessage message={errors.imageUrl.message} />
          )}
          {errors.notes && <ErrorMessage message={errors.notes.message} />}

          <Controller
            control={control}
            name={'merchant'}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Merchant"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.merchant}
                errorMessage={errors.merchant?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
                labelText="Date"
                error={!!errors.date}
                errorMessage={errors.date?.message}
                value={value ?? null}
                mode="date"
                onChange={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="total"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Total"
                value={value ? value.toString() : ''}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="number-pad"
                error={!!errors.total}
                errorMessage={errors.total?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="tax"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Tax"
                value={value ? value.toString() : ''}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="number-pad"
                error={!!errors.tax}
                errorMessage={errors.tax?.message}
              />
            )}
          />

          <Controller
            control={control}
            name={'categoryId'}
            render={({ field: { onChange, value } }) => (
              <Select
                value={value}
                onValueChange={(id) => {
                  onChange(id); // setValue("categoryId", id);
                  const sub =
                    categories.find((cat) => cat.id === id)?.subcategories ||
                    [];
                  setSubcategories(sub);
                  setValue('subcategoryId', undefined);
                }}
                error={!!errors.categoryId}
                errorMessage={errors.categoryId?.message}
              >
                <SelectTrigger
                  placeholder="Select a category"
                  labelText="Category"
                />
                <SelectContent>
                  <ScrollView>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        label={cat.name}
                        value={cat.id}
                      />
                    ))}
                  </ScrollView>
                </SelectContent>
              </Select>
            )}
          />

          {subcategories && subcategories.length > 0 && (
            <Controller
              control={control}
              name={'subcategoryId'}
              render={({ field: { onChange, value } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger
                    placeholder="Select a subcategory"
                    labelText="Subcategory"
                  />
                  <SelectContent>
                    <ScrollView>
                      {subcategories.map((sub) => (
                        <SelectItem
                          key={sub.id}
                          label={sub.name}
                          value={sub.id}
                        />
                      ))}
                    </ScrollView>
                  </SelectContent>
                </Select>
              )}
            />
          )}

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Notes"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.notes}
                errorMessage={errors.notes?.message}
              />
            )}
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={expenseMutation.isPending}
          >
            <ButtonIcon name={'save-outline'} />
            <ButtonText>
              {expense.id === 'new'
                ? expenseMutation.isPending
                  ? 'Creating...'
                  : 'Create'
                : expenseMutation.isPending
                  ? 'Updating...'
                  : 'Update'}
            </ButtonText>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
