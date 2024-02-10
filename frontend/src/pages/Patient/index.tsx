import { useEffect, useState } from "react";
import { Patient } from "../../shared/types";
import { useNavigate, useParams } from "react-router";
import { Button, Container, TextField } from "@mui/material";
import { useCreatePatient, useGetPatient } from "./hooks";

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient>({
    firstName: "",
    lastName: "",
    dob: "01/01/1990",
    status: "Inquiry",
  });

  const { id } = useParams<{ id: string }>();
  const { data } = useGetPatient(id || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (data) setPatient(data);
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id) {
      // TODO: Update existing patient
      useGetPatient(id);
    } else {
      const response = await useCreatePatient(patient);
      if (response?.data?.id) {
        navigate(`/patient/${response?.data?.id}`);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          name="firstName"
          value={patient.firstName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={patient.lastName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date of Birth"
          name="dob"
          value={patient.dob}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        {/* Add other input fields as needed */}
        <Button type="submit" variant="contained" color="primary">
          {id ? "Update Patient" : "Create Patient"}
        </Button>
      </form>
    </Container>
  );
};

export default PatientPage;
