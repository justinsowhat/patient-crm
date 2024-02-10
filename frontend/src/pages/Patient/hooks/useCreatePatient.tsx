import { useAxios } from "../../../shared";
import { Patient } from "../../../shared/types";

export const useCreatePatient = async (patient: Patient) => {
  const axios = useAxios();

  return await axios.post<Patient>("/patients", patient);
};
