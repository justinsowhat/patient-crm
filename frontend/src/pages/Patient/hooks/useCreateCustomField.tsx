import { useAxios } from "../../../shared";
import { CustomField } from "../../../shared/types";

export const useCreateCustomField = async (
  sectionId: string,
  field?: CustomField
) => {
  const axios = useAxios();

  return await axios.post<CustomField>(
    `/customSections/${sectionId}/fields`,
    field
  );
};
