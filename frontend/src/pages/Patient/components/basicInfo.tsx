import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Patient, PatientStatus } from "../../../shared/types";

export interface BasicInfoProps {
  patient?: Patient;
  isEditMode?: boolean;
}

export interface BasicInfoRef {
  getBasicInfo: () => Patient;
}

export const BasicInfo = forwardRef<BasicInfoRef, BasicInfoProps>(
  (props, ref) => {
    const [id] = useState(props.patient?.id);
    const [firstName, setFirstName] = useState(props.patient?.firstName || "");
    const [middleName, setMiddleName] = useState(props.patient?.middleName);
    const [lastName, setLastName] = useState(props.patient?.lastName || "");
    const [dob, setDob] = useState(props.patient?.dob || "");
    const [status, setStatus] = useState<PatientStatus>(
      props.patient?.status || "Inquiry"
    );

    useImperativeHandle(ref, () => ({
      getBasicInfo: () => ({
        id,
        firstName,
        middleName,
        lastName,
        dob,
        status,
      }),
    }));

    return (
      <Box maxWidth="md" minWidth="md" sx={{ margin: "auto" }}>
        <Typography
          variant="h6"
          fontWeight={600}
          marginBottom={3}
          sx={{
            position: "sticky",
            top: 0,
            left: 0,
            width: "100%",
          }}
        >
          Basic Information
        </Typography>
        <Grid
          container
          spacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          alignItems="flex-end"
        >
          {/* First row */}
          <Grid item xs={4}>
            <TextField
              required
              label="First Name"
              InputLabelProps={{
                shrink: true,
              }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!props.isEditMode}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              label="Middle Name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              disabled={!props.isEditMode}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              required
              InputLabelProps={{
                shrink: true,
              }}
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!props.isEditMode}
            />
          </Grid>
          {/* Second row */}
          <Grid item xs={4}>
            <TextField
              required
              InputLabelProps={{
                shrink: true,
              }}
              label="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="MM/dd/yyyy"
              inputProps={{ pattern: "\\d{2}/\\d{2}/\\d{4}" }}
              disabled={!props.isEditMode}
            />
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={3}>
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                defaultValue="Inquiry"
                placeholder="Status"
                disabled={!props.isEditMode}
                onChange={(e) => setStatus(e.target.value as PatientStatus)}
              >
                <MenuItem value="Inquiry">Inquiry</MenuItem>
                <MenuItem value="Onboarding">Onboarding</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Churned">Churned</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    );
  }
);
