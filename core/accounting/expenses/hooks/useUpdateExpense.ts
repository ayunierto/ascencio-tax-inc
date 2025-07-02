import { useEffect, useState } from 'react';

import { Alert } from 'react-native';
import { router, useNavigation } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CreateUpdateExpense, Expense } from '../interfaces';
import { Subcategory } from '../../subcategories/interfaces';
import { Category } from '../../categories/interfaces/category.interface';
import { getExpenseById } from '../actions/get-expense.action';
import { getAccounts } from '../../accounts/actions';
import { removeExpense, updateExpense } from '../actions';
import { getCategories } from '../../categories/actions';
import { getSubcategories } from '../../subcategories/actions';
import { expenseSchema } from '../schemas/createExpenseSchema';
import { useCameraStore } from '@/core/camera/store';

interface Option {
  label: string;
  value: string;
}

export const useUpdateExpense = (expenseId: string) => {
  const navigation = useNavigation();

  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<Option[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Option>();
  const [selectedCategory, setSelectedCategory] = useState<Option>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { selectedImages, clearImages } = useCameraStore();

  const queryClient = useQueryClient();

  const expenseQuery = useQuery({
    queryKey: ['expense', expenseId],
    queryFn: () => getExpenseById(expenseId),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  const accountQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  const categoryQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  const subcategoryQuery = useQuery({
    queryKey: ['subcategories'],
    queryFn: () => getSubcategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useEffect(() => {
    if (expenseQuery.data) {
      const {
        account,
        date,
        merchant,
        category,
        image,
        notes,
        subcategory,
        tax,
        total,
      } = expenseQuery.data;
      setValue('merchant', merchant);
      setValue('date', date);
      setValue('total', total.toString());
      setValue('tax', tax.toString());
      setValue('image', image ? image : undefined);
      setValue('accountId', account.id);
      setValue('categoryId', category.id);
      if (subcategory) {
        setValue('subcategoryId', subcategory.id);
      }
      if (notes) {
        setValue('notes', notes);
      }
      setSelectedCategory(
        category && {
          label: category.name,
          value: category.id,
        }
      );
      setSelectedSubcategory(
        subcategory
          ? {
              label: subcategory.name,
              value: subcategory.id,
            }
          : undefined
      );
    }
  }, [expenseQuery.data]);

  useEffect(() => {
    if (categoryQuery.isSuccess) {
      const options = categoryQuery.data.map((category: Category) => ({
        label: category.name,
        value: category.id.toString(),
      }));
      setCategoryOptions(options);
    }
  }, [categoryQuery.isSuccess, categoryQuery.data]);

  useEffect(() => {
    if (subcategoryQuery.isSuccess) {
      const options = subcategoryQuery.data.map((subcategory: Subcategory) => ({
        label: subcategory.name,
        value: subcategory.id,
      }));
      setSubcategoryOptions(options);
    }
  }, [subcategoryQuery.isSuccess, subcategoryQuery.data]);

  const onChangeCategory = async (value: string) => {
    if (subcategoryQuery.data) {
      const subcategories = subcategoryQuery.data.filter(
        (subcategory: Subcategory) => subcategory.category!.id === value
      );
      const options = subcategories.map((subcategory: Subcategory) => ({
        label: subcategory.name,
        value: subcategory.id,
      }));
      setSubcategoryOptions(options);
      setSelectedSubcategory(options[0]);
      setValue('subcategoryId', options[0].value);
    }
  };

  const updateExpenseMutation = useMutation({
    mutationFn: async (values: CreateUpdateExpense): Promise<Expense> => {
      const image = getValues('image');
      const data = await updateExpense({
        id: expenseId,
        image: image && image.includes('file') ? image : undefined,
        ...values,
      });
      return data;
    },

    onSuccess: async (data: Expense) => {
      await queryClient.invalidateQueries({
        queryKey: ['expenses', 'infinite'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['expense', expenseId],
      });
      await queryClient.invalidateQueries({
        queryKey: ['totalExpenses'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['logs'],
      });
      Toast.show({
        type: 'success',
        text1: `Receipt ${data.merchant} updated`,
        text2: 'Receipt was updated correctly',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 12 },
      });
      clearImages();
      router.replace('/accounting/receipts/expense');
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId: string): Promise<Expense> => {
      const data = await removeExpense(expenseId);
      return data;
    },

    onSuccess: async (data: Expense) => {
      await queryClient.invalidateQueries({
        queryKey: ['expenses', 'infinite'],
      });
      // await queryClient.invalidateQueries({
      //   queryKey: ['expense', expenseId],
      // });
      await queryClient.invalidateQueries({
        queryKey: ['totalExpenses'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['logs'],
      });
      Toast.show({
        type: 'success',
        text1: `Receipt ${data.merchant} deleted`,
        text2: 'Receipt was deleted correctly',
        text1Style: { fontSize: 14 },
        text2Style: { fontSize: 12 },
      });
      clearImages();
      router.replace('/accounting/receipts/expense');
    },
  });

  const onSubmit = async (values: z.infer<typeof expenseSchema>) => {
    setIsFetching(true);
    await updateExpenseMutation.mutateAsync({
      ...values,
      total: +values.total,
      tax: +values.tax,
    });
    setIsFetching(false);
  };

  const onDelete = async () => {
    setIsDeleting(true);
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpenseMutation.mutateAsync(expenseId);
            } catch (error) {
              console.error(error);
              Toast.show({
                type: 'error',
                text1: 'Error deleting receipt',
                text2: 'There was an error deleting the receipt',
                text1Style: { fontSize: 14 },
                text2Style: { fontSize: 12 },
              });
            }
          },
        },
      ]
    );
    setIsDeleting(false);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {},
  });

  return {
    accountQuery,
    categoryOptions,
    control,
    errors,
    expenseQuery,
    handleSubmit,
    isDeleting,
    isFetching,
    isLoading: expenseQuery.isLoading || accountQuery.isLoading,
    navigation,
    onChangeCategory,
    onDelete,
    onSubmit,
    selectedCategory,
    selectedImages,
    selectedSubcategory,
    setValue,
    subcategoryOptions,
    watch,
  };
};
