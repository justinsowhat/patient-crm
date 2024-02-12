import { useAxios } from "../../../shared";
import { CustomSection } from "../../../shared/types";

export const useCreateCustomSection = async (customSection?: CustomSection) => {
  const axios = useAxios();

  return await axios.post<CustomSection>("/customSections", customSection);
};
