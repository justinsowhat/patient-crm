import { useAxios } from "../../../shared";
import { Address } from "../../../shared/types";
import { useQuery } from "react-query";

export const useGetPatientAddresses = (id: string) => {
  const axios = useAxios();

  return useQuery(
    ["addresses", id],
    () => axios.get<Address[]>(`/patients/${id}/addresses`, {}),
    {
      enabled: !!id,
      refetchOnMount: false,
      select: (response) => response?.data,
    }
  );
};
