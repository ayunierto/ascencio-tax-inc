import { api } from "@/core/api/api";
import { CreateExpenseRequest, CreateExpenseResponse } from "../interfaces";
import { uploadImage } from "@/core/files/actions/upload-image.action";

export const createExpense = async (
  expense: CreateExpenseRequest
): Promise<CreateExpenseResponse> => {
  try {
    if (expense.image && !(typeof expense.image === "string")) {
      const uploadedImage = await uploadImage(expense.image);
      if (uploadedImage && "image" in uploadedImage) {
        expense.image = uploadedImage.image;
      }
    }

    const { data } = await api.post<CreateExpenseResponse>("expense", expense);

    return data;
  } catch (error) {
    throw error;
  }
};
