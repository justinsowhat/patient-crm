import { Box, Button, Container } from "@mui/material";
import { PatientsTable } from "./components";
import { useNavigate } from "react-router";
import AddIcon from "@mui/icons-material/Add"; // Import the Plus icon

const Patients = () => {
  const navigate = useNavigate();

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
      <Container>
        <PatientsTable />
      </Container>
    </Box>
  );
};

export default Patients;
