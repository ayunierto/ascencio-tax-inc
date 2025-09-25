import { api } from "@/core/api/api";
import { UpdateExpenseRequest, UpdateExpenseResponse } from "../interfaces";
import { uploadImage } from "@/core/files/actions/upload-image.action";

export const updateExpense = async (
  id: string,
  expense: Partial<UpdateExpenseRequest>
): Promise<UpdateExpenseResponse> => {
  try {
    // Try to upload the image if it exists and is not a string
    if (expense.image && typeof expense.image !== "string") {
      const uploadedImage = await uploadImage(expense.image);
      if ("error" in uploadedImage) {
        console.error(uploadedImage);
        return uploadedImage;
      }
      expense.image = uploadedImage.image;
    }

    const { data } = await api.patch<UpdateExpenseResponse>(
      `expense/${id}`,
      expense
    );

    return data;
  } catch (error) {
    throw error;
  }
};
