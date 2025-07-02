import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime } from 'luxon';

import { getAccounts } from '../../accounts/actions';
import { getCategories } from '../../categories/actions';
import { getSubcategories } from '../../subcategories/actions';
import { Subcategory } from '../../subcategories/interfaces';
import { useCameraStore } from '@/core/camera/store';
import { SelectOption } from '@/components/ui/Select';
import { useCreateExpenseMutation } from './useCreateExpenseMutation';
import { CreateExpenseFormInputs, createExpenseSchema } from '../schemas';

export const useCreateExpense = () => {
  const params = useLocalSearchParams();

  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<SelectOption[]>(
    []
  );
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<SelectOption>();

  const { selectedImage, removeImage } = useCameraStore();

  // Set values if provided
  useEffect(() => {
    setValue('merchant', (params.merchant as string) || '');
    setValue('total', Number(params.total as string) || 0);
    setValue('tax', Number(params.tax as string) || 0);
    setValue('date', (params.date as string) || DateTime.now().toISO());

    return () => {
      removeImage();
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateExpenseFormInputs>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      date: new Date().toISOString(),
    },
  });

  // Fetching necessary data.
  const { data: accounts, isPending: isAccountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  const { data: categories, isPending: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  const { data: subcategories, isPending: isSubcategoriesLoading } = useQuery({
    queryKey: ['subcategories'],
    queryFn: () => getSubcategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Set category options.
  useEffect(() => {
    if (categories && !('error' in categories)) {
      const options = categories.map((category) => ({
        label: category.name,
        value: category.id,
      }));
      setCategoryOptions(options);
    }
  }, [categories]);

  // Sets the first selected account as default.
  useEffect(() => {
    if (accounts && !('error' in accounts) && accounts.length > 0) {
      setValue('accountId', accounts[0].id);
    }
  }, [accounts]);

  const handleChangeCategory = async (categoryId: string) => {
    setValue('categoryId', categoryId);

    if (subcategories && !('error' in subcategories)) {
      const subcat = subcategories.filter(
        (subcategory: Subcategory) => subcategory.category.id === categoryId
      );
      const options = subcat.map((subcategory: Subcategory) => ({
        label: subcategory.name,
        value: subcategory.id,
      }));
      setSubcategoryOptions(options);
      setSelectedSubcategory(options[0]);
      setValue('subcategoryId', options[0].value);
    }
  };

  const { mutate: saveReceipt, isPending: isSavingExpense } =
    useCreateExpenseMutation();

  const handleCreateExpense = async (data: CreateExpenseFormInputs) => {
    saveReceipt(data);
  };

  return {
    accounts,
    isAccountsLoading,
    categories,
    isCategoriesLoading,
    subcategories,
    isSubcategoriesLoading,
    categoryOptions,
    subcategoryOptions,
    control,
    errors,
    setValue,
    handleSubmit,
    handleChangeCategory,
    handleCreateExpense,
    selectedImage,
    selectedSubcategory,
    isSavingExpense,
  };
};
