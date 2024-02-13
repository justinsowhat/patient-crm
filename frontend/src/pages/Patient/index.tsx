import { useState } from "react";
import { useParams } from "react-router";
import { Box, Button } from "@mui/material";
import { useGetPatient, useGetPatientAddresses } from "./hooks";
import { PatientForm } from "./components/patientForm";
import { useGetPatientCustomSectionValues } from "./hooks/useGetPatientCustomSectionValues";
import { useEdit } from "../../shared";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: patient, isLoading: isPatientDataLoading } = useGetPatient(
    id || ""
  );
  const { data: addresses, isLoading: isAddressDataLoading } =
    useGetPatientAddresses(patient?.id || "");

  const { data: customSections, isLoading: isCustomSectionsDataLoading } =
    useGetPatientCustomSectionValues(patient?.id || "");

  const { isEdit, setIsEdit } = useEdit();
  const isCreateMode = id === undefined;

  // TODO: add a hamster wheel
  if (
    isPatientDataLoading ||
    isAddressDataLoading ||
    isCustomSectionsDataLoading
  ) {
    return <></>;
  }

  //TODO: fix the location of the buttons

  return (
    <Box
      width="60vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
    >
      {!isCreateMode && !isEdit && (
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: "20px", alignSelf: "flex-start" }}
          onClick={() => setIsEdit(true)}
        >
          Edit
        </Button>
      )}
      <PatientForm
        patient={patient}
        addresses={addresses}
        customSections={customSections?.data}
        isEditMode={isEdit}
        isCreateMode={isCreateMode}
      />
    </Box>
  );
};

export default PatientPage;
