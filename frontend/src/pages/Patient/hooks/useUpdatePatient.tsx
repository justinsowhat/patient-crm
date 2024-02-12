import { useQueryClient } from "react-query";
import { useAxios, parseToken } from "../../../shared";
import { Patient } from "../../../shared/types";

export const useUpdatePatient = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const updatePatient = async (patient?: Patient) => {
    const { userId } = parseToken();

    await axios.put<Patient>(`/patients`, patient);

    // Invalidate the query cache for this list after successful update
    queryClient.invalidateQueries(["patient", patient?.id, userId]);
    queryClient.invalidateQueries(["patients", userId]);
  };

  return updatePatient;
};
