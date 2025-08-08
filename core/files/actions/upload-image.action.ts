import { UploadImageFile } from '../interfaces/upload-image.interface';
import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { handleApiErrors } from '@/core/auth/utils/handleApiErrors';
import { ExceptionResponse } from '@/core/interfaces';
import { ImagePickerAsset } from 'expo-image-picker';

export const uploadImage = async (
  image: ImagePickerAsset
): Promise<UploadImageFile | ExceptionResponse> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formdata = new FormData() as any;
    formdata.append('file', {
      uri: image.uri,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    const response = await httpClient.post<UploadImageFile | ExceptionResponse>(
      'files/upload',
      {
        body: formdata,
      }
    );

    return response;
  } catch (error) {
    console.error(error);
    return handleApiErrors(error, 'uploadImage');
  }
};
