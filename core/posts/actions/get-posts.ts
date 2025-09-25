import { api } from "@/core/api/api";
import { GetPostsResponse } from "../interfaces";

export const getPosts = async (): Promise<GetPostsResponse> => {
  try {
    const { data } = await api.get<GetPostsResponse>("/posts");

    return data;
  } catch (error) {
    throw error;
  }
};
