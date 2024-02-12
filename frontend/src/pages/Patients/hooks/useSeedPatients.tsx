import { useQueryClient } from "react-query";
import { parseToken, useAxios } from "../../../shared";

export const useSeedPatients = () => {
  const axios = useAxios();
  const { userId } = parseToken();
  const queryClient = useQueryClient();

  const seedPatients = async () => {
    await axios.post(`/patients/seed`, {});

    queryClient.invalidateQueries(["patients", userId]);
  };

  return seedPatients;
};
