import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../actions";
import { Category } from "../interfaces/category.interface";
import { AxiosError } from "axios";
import { ServerException } from "@/core/interfaces/server-exception.response";

export const useCategories = () => {
  return useQuery<
    Category[],
    AxiosError<ServerException>,
    Category[],
    string[]
  >({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};
