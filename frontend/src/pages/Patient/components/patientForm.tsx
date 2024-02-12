import { useRef } from "react";
import { Address, CustomSection, Patient } from "../../../shared/types";
import {
  AddressForm,
  AddressRef,
  BasicInfo,
  BasicInfoRef,
  CustomSections,
  CustomSectionsRef,
} from ".";
import { Button, Container, Grid, Typography } from "@mui/material";
import {
  useCreatePatient,
  useUpdateAddresses,
  useUpdatePatient,
} from "../hooks";
import { useNavigate } from "react-router";
import { useCreateAddresses } from "../hooks/useCreateAddresses";
import { useUpdateCustomSectionValues } from "../hooks/useUpdateCustomSectionValues";
import { useEdit } from "../../../shared";

export interface PatientFormProps {
  patient?: Patient;
  addresses?: Address[];
  customSections?: CustomSection[];
  isEditMode: boolean;
  isCreateMode: boolean;
}

export const PatientForm = ({
  patient,
  addresses,
  customSections,
  isEditMode,
  isCreateMode,
}: PatientFormProps) => {
  const { setIsEdit } = useEdit();

  const basicInfoRef = useRef<BasicInfoRef>(null);
  const mailingAddressRef = useRef<AddressRef>(null);
  const billingAddressRef = useRef<AddressRef>(null);
  const customSectionsRef = useRef<CustomSectionsRef>(null);

  const editEnabled = isEditMode || isCreateMode;

  const navigate = useNavigate();
  const updatePatient = useUpdatePatient();
  const updateAddresses = useUpdateAddresses();
  const updateCustomSections = useUpdateCustomSectionValues();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const basicInfo: Patient | undefined = basicInfoRef.current?.getBasicInfo();

    const mailingAddress: Address | undefined =
      mailingAddressRef.current?.getAddress();
    const billingAddress: Address | undefined =
      billingAddressRef.current?.getAddress();
    let addresses = [];
    if (mailingAddress !== undefined) addresses.push(mailingAddress);
    if (billingAddress !== undefined) addresses.push(billingAddress);

    const customSections: CustomSection[] | undefined =
      customSectionsRef.current?.getCustomSections();

    if (isEditMode) {
      updatePatient(basicInfo);
      updateAddresses(basicInfo?.id || "", addresses);
      updateCustomSections(basicInfo?.id || "", customSections);
      setIsEdit(false);
    }

    if (isCreateMode) {
      const response = await useCreatePatient(basicInfo);

      if (response?.data?.id) {
        await useCreateAddresses(response?.data?.id, addresses);
        updateCustomSections(response?.data?.id, customSections);
        navigate(`/patient/${response?.data?.id}`);
      }
    }
  };

  const handleCancel = () => {
    if (patient?.id) {
      setIsEdit(false);
      navigate(`/patient/${patient?.id}`);
    } else {
      navigate("/patients");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <BasicInfo
        ref={basicInfoRef}
        patient={patient}
        isEditMode={editEnabled}
      />

      <Grid container spacing={3} marginTop={5}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={600}>
            Mailing Address
          </Typography>
          <AddressForm
            ref={mailingAddressRef}
            isEditMode={editEnabled}
            address={addresses?.find((a) => a.type == "mailing")}
            addressType={"mailing"}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" fontWeight={600}>
            Billing Address
          </Typography>
          <AddressForm
            ref={billingAddressRef}
            isEditMode={editEnabled}
            address={addresses?.find((a) => a.type == "billing")}
            addressType={"billing"}
          />
        </Grid>
      </Grid>

      <CustomSections
        editEnabled={editEnabled}
        ref={customSectionsRef}
        customSections={customSections}
      />

      {editEnabled && (
        <Container sx={{ marginTop: "30px" }}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
          <Button
            sx={{ marginLeft: "20px" }}
            variant="outlined"
            color="error"
            onClick={() => handleCancel()}
          >
            Cancel
          </Button>
        </Container>
      )}
    </form>
  );
};
