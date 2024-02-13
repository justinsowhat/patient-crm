import { useAxios } from "../../../shared";
import { AxiosResponse, CustomField } from "../../../shared/types";

export const useCreateCustomField = async (
  sectionId: string,
  field?: CustomField
) => {
  const axios = useAxios();

  return await axios.post<AxiosResponse<CustomField>>(
    `/customSections/${sectionId}/fields`,
    field
  );
};
