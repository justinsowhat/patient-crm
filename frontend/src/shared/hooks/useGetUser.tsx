import { parseToken } from "../utils/jwt";
import { useAxios } from "./useAxios";
import { useQuery } from "react-query";

interface User {
  email: string;
  id: number;
  firstName: string;
  lastName: string;
}

export const useGetUser = () => {
  const axios = useAxios();

  const { userId } = parseToken();

  return useQuery(
    ["user", userId],
    () => axios.get<User>(`/users/${userId}`, {}),
    {
      enabled: !!userId,
      refetchOnMount: false,
      select: (response) => response?.data,
    }
  );
};
