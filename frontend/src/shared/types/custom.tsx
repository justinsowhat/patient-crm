export type CustomSection = {
  id?: string;
  name: string;
  fields: CustomField[];
};

export type CustomField = {
  id?: string;
  name: string;
  dataType: "number" | "text";
  value?: string;
};
