import { useAxios } from "../../../shared";
import { Address, Patient } from "../../../shared/types";

export const useCreateAddresses = async (
  patientId: string,
  addresses?: Address[]
) => {
  const axios = useAxios();

  return await axios.post<Patient>(
    `/patients/${patientId}/addresses`,
    addresses
  );
};
