import { useQueryClient } from "react-query";
import { useAxios } from "../../../shared";
import { Address } from "../../../shared/types";

export const useUpdateAddresses = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const updateAddresses = async (patientId: string, addresses?: Address[]) => {
    await axios.put<Address[]>(`/patients/${patientId}/addresses`, addresses);

    // Invalidate the query cache for this list after successful update
    queryClient.invalidateQueries(["addresses", patientId]);
  };

  return updateAddresses;
};
