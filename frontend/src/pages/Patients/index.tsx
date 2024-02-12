import { Box, Button, Container } from "@mui/material";
import { PatientsTable } from "./components";
import { useNavigate } from "react-router";
import AddIcon from "@mui/icons-material/Add"; // Import the Plus icon
import { useSeedPatients } from "./hooks";

const Patients = () => {
  const navigate = useNavigate();
  const seedPatients = useSeedPatients();

  return (
    <Box display="flex" flexDirection="column" height="90vh">
      <Button
        variant="contained"
        color="primary"
        sx={{ width: "200px", marginLeft: "25px", marginBottom: "20px" }}
        startIcon={<AddIcon />}
        onClick={() => navigate("/patient")}
      >
        Create a Patient
      </Button>

      <Button
        variant="contained"
        color="primary"
        sx={{ width: "250px", marginLeft: "25px", marginBottom: "20px" }}
        startIcon={<AddIcon />}
        onClick={async () => await seedPatients()}
      >
        Create Test Patients
      </Button>
      <Container>
        <PatientsTable />
      </Container>
    </Box>
  );
};

export default Patients;
