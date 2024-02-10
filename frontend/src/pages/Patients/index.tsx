import { Box, Button, Container } from "@mui/material";
import { PatientsTable } from "./components";
import { useNavigate } from "react-router";

const Patients = () => {
  const navigate = useNavigate();

  return (
    <Box width="85vw" height="80vh" paddingLeft="5px" marginLeft="5px">
      <Button onClick={() => navigate("/patient")}>Create a Patient</Button>
      <Container>
        <PatientsTable />
      </Container>
    </Box>
  );
};

export default Patients;
