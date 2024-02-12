import { forwardRef, useImperativeHandle, useState } from "react";
import {
  TextField,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Address } from "../../../shared/types";
import { stateList } from "../types";

export interface AddressProps {
  address?: Address;
  addressType: string;
  isEditMode: boolean;
}
export interface AddressRef {
  getAddress: () => Address;
}

export const AddressForm = forwardRef<AddressRef, AddressProps>(
  (props, ref) => {
    const [id] = useState(props.address?.id);
    const [street1, setStreet1] = useState(props.address?.street1 || "");
    const [street2, setStreet2] = useState(props.address?.street2 || "");
    const [city, setCity] = useState(props.address?.city || "");
    const [state, setState] = useState(props.address?.state || "");
    const [zip, setZipCode] = useState(props.address?.zip || "");
    const [type] = useState(props.addressType);

    useImperativeHandle(ref, () => ({
      getAddress: () => ({
        id,
        street1,
        street2,
        city,
        state,
        zip,
        type,
      }),
    }));

    return (
      <Box>
        <TextField
          required
          id={`${props.addressType}-street1`}
          name={`${props.addressType}-street1`}
          label="Street 1"
          fullWidth
          margin="normal"
          value={street1}
          disabled={!props.isEditMode}
          onChange={(e) => setStreet1(e.target.value)}
        />
        <TextField
          id={`${props.addressType}-street2`}
          name={`${props.addressType}-street2`}
          label="Street 2"
          fullWidth
          margin="normal"
          value={street2}
          disabled={!props.isEditMode}
          onChange={(e) => setStreet2(e.target.value)}
        />
        <TextField
          required
          id={`${props.addressType}-city`}
          name={`${props.addressType}-city`}
          label="City"
          fullWidth
          margin="normal"
          value={city}
          disabled={!props.isEditMode}
          onChange={(e) => setCity(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="state-label">State</InputLabel>
          <Select
            labelId="state-label"
            id={`${props.addressType}-state`}
            name={`${props.addressType}-state`}
            value={state}
            label="State"
            disabled={!props.isEditMode}
            onChange={(e) => setState(e.target.value)}
          >
            {stateList.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          required
          id={`${props.addressType}-zip`}
          name={`${props.addressType}-zip`}
          label="Zip Code"
          fullWidth
          margin="normal"
          value={zip}
          inputProps={{ maxLength: 5, pattern: "\\d{5}" }}
          disabled={!props.isEditMode}
          onChange={(e) => setZipCode(e.target.value)}
        />
      </Box>
    );
  }
);
