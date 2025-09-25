import { UpdateProfileRequest } from "../schemas/update-profile.schema";
import { UpdateProfileResponse } from "../interfaces/update-profile.interface";
import { api } from "@/core/api/api";

export const updateProfileAction = async ({
  lastName,
  firstName,
  password,
  phoneNumber,
}: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  const userUpdate = {
    lastName,
    firstName,
    password,
    phoneNumber,
  };

  try {
    const { data } = await api.patch<UpdateProfileResponse>(
      "auth/update-profile",
      userUpdate
    );
    return data;
  } catch (error) {
    throw error;
  }
};
