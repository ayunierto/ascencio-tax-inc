import { Post } from '../interfaces';

export const getPosts = async (): Promise<Post[]> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/posts`);

    const posts: Post[] = await response.json();

    return posts;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching posts');
  }
};
