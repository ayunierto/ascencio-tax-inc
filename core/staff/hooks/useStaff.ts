import { useQuery } from "@tanstack/react-query";
import { getStaffAction } from "../actions/get-staff.action";
import { Staff } from "../interfaces";
import { AxiosError } from "axios";
import { ServerException } from "@/core/interfaces/server-exception.response";

export const useStaff = () => {
  return useQuery<Staff[], AxiosError<ServerException>, Staff[], string[]>({
    queryKey: ["staff"],
    queryFn: getStaffAction,
  });
};
