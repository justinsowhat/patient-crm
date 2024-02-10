export type Patient = {
  id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  status: "Inquiry" | "Onboarding" | "Active" | "Churned";
  addresses?: Address[];
};

export type Address = {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  type: string;
};

export type CustomField = {
  fieldName: string;
  dataType: string;
  value?: number | string;
};
