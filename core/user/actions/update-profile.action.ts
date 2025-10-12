import { UpdateProfileRequest } from "../schemas/update-profile.schema";
import { UpdateProfileResponse } from "../interfaces/update-profile.interface";
import { api } from "@/core/api/api";

export const updateProfileAction = async ({
  lastName,
  firstName,
  password,
  phoneNumber,
}: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  const { data } = await api.patch<UpdateProfileResponse>(
    "auth/update-profile",
    {
      lastName,
      firstName,
      password,
      phoneNumber,
    }
  );
  return data;
};
