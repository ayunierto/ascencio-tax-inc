import { api } from "@/core/api/api";
import { UpdateExpenseResponse } from "../interfaces";
import { uploadImage } from "@/core/files/actions/upload-image.action";
import { ExpenseFormFields } from "../schemas";

export const updateExpense = async (
  id: string,
  expense: Partial<ExpenseFormFields>
): Promise<UpdateExpenseResponse> => {
  // Try to upload the image if it exists and is not a string
  if (expense.imageFile) {
    const uploadedImage = await uploadImage(expense.imageFile);
    if ("error" in uploadedImage) {
      console.error(uploadedImage);
      return uploadedImage;
    }
    expense.imageUrl = uploadedImage.image;
  }

  const { data } = await api.patch<UpdateExpenseResponse>(
    `expenses/${id}`,
    expense
  );

  return data;
};
