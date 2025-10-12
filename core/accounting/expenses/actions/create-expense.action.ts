import { api } from "@/core/api/api";
import { CreateExpenseResponse } from "../interfaces";
import { uploadImage } from "@/core/files/actions/upload-image.action";
import { ExpenseFormFields } from "../schemas";

export const createExpense = async (
  expense: ExpenseFormFields
): Promise<CreateExpenseResponse> => {
  if (expense.imageFile) {
    const uploadedImage = await uploadImage(expense.imageFile);
    if (uploadedImage && "image" in uploadedImage) {
      expense.imageUrl = uploadedImage.image;
    }
  }

  const { data } = await api.post<CreateExpenseResponse>("/expenses", expense);

  return data;
};
