import { useQueryClient } from "react-query";
import { useAxios, parseToken } from "../../../shared";
import { CustomSection } from "../../../shared/types";

type CustomFieldValue = {
  patientId: string;
  customFieldId?: string;
  value?: string;
};

export const useUpdateCustomSectionValues = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const updatePatient = async (
    patientId: string,
    sections?: CustomSection[]
  ) => {
    const { userId } = parseToken();

    let request: CustomFieldValue[] = [];

    sections?.forEach((section) =>
      section.fields?.forEach((f) =>
        request.push({
          patientId: patientId,
          customFieldId: f.id,
          value: f.value,
        })
      )
    );

    await axios.put<CustomFieldValue[]>(
      `/patients/${patientId}/customSections`,
      request
    );

    // Invalidate the query cache for this list after successful update
    queryClient.invalidateQueries(["sections", patientId, userId]);
  };

  return updatePatient;
};
