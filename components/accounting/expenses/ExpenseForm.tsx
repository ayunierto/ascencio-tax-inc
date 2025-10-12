import { View, FlatList } from "react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExpenseFormFields,
  expenseSchema,
} from "@/core/accounting/expenses/schemas";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/Button";
import { ExpenseResponse } from "@/core/accounting/expenses/interfaces";
import { Input } from "@/components/ui/Input";
import DateTimePicker from "@/components/ui/DateTimePicker/DateTimePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/Select";
import { useCategories } from "@/core/accounting/categories/hooks/useCategories";
import { EmptyContent } from "@/core/components";
import Loader from "@/components/Loader";
import { Subcategory } from "@/core/accounting/subcategories/interfaces";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/core/api/api";
import { AxiosError } from "axios";
import { ServerException } from "@/core/interfaces/server-exception.response";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

interface ExpenseFormProps {
  expense: ExpenseResponse;
}

export default function ExpenseForm({ expense }: ExpenseFormProps) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ExpenseFormFields>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense,
  });

  const { data: categories, isError, error, isLoading } = useCategories();

  const createUpdateExpense = async (expense: ExpenseFormFields) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, imageFile, ...rest } = expense;
    const { data } = await api.post("/expenses", rest);
    return data;
  };

  const mutation = useMutation<
    ExpenseResponse,
    AxiosError<ServerException>,
    ExpenseFormFields
  >({
    mutationFn: createUpdateExpense,
    onSuccess: (data) => {
      console.log("Success", data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit = async (values: ExpenseFormFields) => {
    console.log(values);
    await mutation.mutateAsync(values, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Expense created successfully",
        });
        reset();
        router.replace("/(tabs)/accounting/receipts/expense");
      },
      onError: (error) => {
        console.log(error);
        Toast.show({
          type: "error",
          text1: "Error creating expense",
        });
      },
    });
  };

  if (isError) {
    return (
      <EmptyContent
        title="Error"
        subtitle={error.response?.data.message || error.message}
        icon="sad-outline"
      />
    );
  }
  if (isLoading) {
    return <Loader message="Loading categories..." />;
  }
  if (!categories || categories.length === 0) {
    return (
      <EmptyContent
        title="Info"
        subtitle="No categories found. Please contact support."
        icon="information-circle-outline"
      />
    );
  }

  return (
    <View style={{ margin: 20, gap: 20 }}>
      {/* <ThemedText>Receipt image:</ThemedText>
          <ExpenseImage
            onChange={(image) => {
              setValue("image", image);
            }}
            image={
              selectedImages.length > 0
                ? selectedImages[0].uri
                : (expenseQuery.data.image ?? null)
            }
          /> */}

      <Controller
        control={control}
        name={"merchant"}
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
            value={value ? value.toString() : ""}
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
            }}
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
            value={value ? value.toString() : ""}
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
        name={"categoryId"}
        render={({ field: { onChange, value } }) => (
          <Select
            value={value}
            onValueChange={(id) => {
              onChange(id);
              const sub =
                categories.find((cat) => cat.id === id)?.subcategories || [];
              setSubcategories(sub);
              setValue("subcategoryId", undefined);
            }}
            error={!!errors.categoryId}
            errorMessage={errors.categoryId?.message}
          >
            <SelectTrigger
              placeholder="Select a category"
              labelText="Category"
            />
            <SelectContent>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item: opt }) => (
                  <SelectItem key={opt.id} label={opt.name} value={opt.id} />
                )}
              />
            </SelectContent>
          </Select>
        )}
      />
      {error}

      {subcategories && subcategories.length > 0 && (
        <Controller
          control={control}
          name={"subcategoryId"}
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger
                placeholder="Select a subcategory"
                labelText="Subcategory"
              />
              <SelectContent>
                <FlatList
                  data={subcategories}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item: opt }) => (
                    <SelectItem key={opt.id} label={opt.name} value={opt.id} />
                  )}
                />
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
        // disabled={isFetching}
      >
        <ButtonIcon name="save-outline" />
        <ButtonText>{expense.id === "new" ? "Create" : "Update"}</ButtonText>
      </Button>
    </View>
  );
}
