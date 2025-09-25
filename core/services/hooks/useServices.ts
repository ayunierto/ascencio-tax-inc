import React from "react";
import { useQuery } from "@tanstack/react-query";
import { GetServicesResponse, Service } from "../interfaces";
import { ServerException } from "@/core/interfaces/server-exception.response";
import { AxiosError } from "axios";
import { getServices } from "../actions";

export const useServices = () => {
  return useQuery<
    GetServicesResponse,
    AxiosError<ServerException>,
    GetServicesResponse
  >({
    queryKey: ["services"],
    queryFn: getServices,
    staleTime: 1000 * 60 * 5, // 5 min
    retry: false,
  });
};
