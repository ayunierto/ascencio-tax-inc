import { httpClient } from '@/core/adapters/http/httpClient.adapter';
import { handleApiErrors } from '@/core/auth/utils';
import { GetPostsResponse } from '../interfaces';

export const getPosts = async (): Promise<GetPostsResponse> => {
  try {
    const res = await httpClient.get<GetPostsResponse>(`posts`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res;
  } catch (error) {
    console.error(error);
    return handleApiErrors(error, 'getPosts');
  }
};
