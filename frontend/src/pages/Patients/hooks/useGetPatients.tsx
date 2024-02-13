import { useQuery } from "react-query";
import { parseToken, useAxios } from "../../../shared";
import { AxiosResponse, Patient } from "../../../shared/types";

export const useGetPatients = () => {
  const axios = useAxios();
  const { userId } = parseToken();

  const getPatients = async () => {
    return await axios.get<AxiosResponse<Patient[]>>("patients", {
      params: {
        user_id: userId,
      },
    });
  };

  return useQuery<AxiosResponse<Patient[]>, Error>(
    ["patients", userId],
    async () => {
      const response = await getPatients();
      return response.data;
    }
  );
};
