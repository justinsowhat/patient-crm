import { useQuery } from "react-query";
import { parseToken, useAxios } from "../../../shared";
import { AxiosResponse, CustomSection } from "../../../shared/types";

export const useGetPatientCustomSectionValues = (patientId: string) => {
  const axios = useAxios();
  const { userId } = parseToken();

  const getSections = async () => {
    return await axios.get<AxiosResponse<CustomSection[]>>(
      `patients/${patientId}/customSections`,
      {}
    );
  };

  return useQuery<AxiosResponse<CustomSection[]>, Error>(
    ["sections", userId, patientId],
    async () => {
      const response = await getSections();
      return response.data;
    }
  );
};
