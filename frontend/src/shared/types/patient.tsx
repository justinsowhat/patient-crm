export type PatientStatus = "Inquiry" | "Onboarding" | "Active" | "Churned";

export type Patient = {
  id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  status: PatientStatus;
};

export type Address = {
  id?: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  type: string;
};
