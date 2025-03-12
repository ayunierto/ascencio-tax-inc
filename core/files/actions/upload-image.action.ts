import * as SecureStore from 'expo-secure-store';

import { UploadImageFile } from '../interfaces/upload-image.interface';

export const uploadImage = async (image: string): Promise<UploadImageFile> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formdata = new FormData() as any;
    formdata.append('file', {
      uri: image,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    const requestOptions = {
      method: 'POST',
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(`${API_URL}/files/upload`, requestOptions);

    const data: UploadImageFile = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('The image could not be uploaded');
  }
};
