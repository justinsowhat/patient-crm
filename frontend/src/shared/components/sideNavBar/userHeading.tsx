import { Box, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

type UserHeadingProps = {
  firstName: string;
  lastName: string;
};

export const UserHeading = ({ firstName, lastName }: UserHeadingProps) => {
  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center">
        <PersonIcon />
      </Box>
      <Box textAlign="center">
        <Typography
          variant="h5"
          color=""
          fontWeight="bold"
          sx={{ m: "10px 0 0 0" }}
        >
          {firstName} {lastName}
        </Typography>
      </Box>
    </>
  );
};
