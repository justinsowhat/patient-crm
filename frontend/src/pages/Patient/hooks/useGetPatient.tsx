import { useAxios, parseToken } from "../../../shared";
import { Patient } from "../../../shared/types";
import { useQuery } from "react-query";

export const useGetPatient = (id: string) => {
  const axios = useAxios();

  const { userId } = parseToken();

  return useQuery(
    ["patient", id, userId],
    () =>
      axios.get<Patient>(`/patients/${id}`, {
        params: {
          provider_id: userId,
        },
      }),
    {
      enabled: !!id,
      refetchOnMount: false,
      select: (response) => response?.data,
    }
  );
};
