import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { getServicesAction } from "../actions/get-services.action";
import { ServicesResponse } from "../interfaces";
import { ServerException } from "@/core/interfaces/server-exception.response";

export const useServices = (limit: number = 100, offset = 0) => {
  return useQuery<
    ServicesResponse,
    AxiosError<ServerException>,
    ServicesResponse
  >({
    queryKey: ["services", { offset, limit }],
    queryFn: () =>
      getServicesAction({
        limit: isNaN(limit) ? 9 : limit,
        offset: isNaN(offset) ? 0 : offset,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: false,
  });
};
