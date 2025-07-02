import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '@/core/auth/interfaces';

import { handleApiErrors } from '@/core/auth/utils';

export const updateProfile = async ({
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

  if (!password) {
    delete userUpdate.password;
  }

  if (!phoneNumber) {
    delete userUpdate.phoneNumber;
  }

  try {
    const response = await httpClient.patch<UpdateProfileResponse>(
      'auth/update-profile',
      {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userUpdate),
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    return handleApiErrors(error, 'updateProfile');
  }
};
