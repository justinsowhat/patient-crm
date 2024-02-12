import { Box, MenuItem, Select } from "@mui/material";
import {
  GridCellParams,
  GridColDef,
  GridFilterInputValueProps,
  GridFilterItem,
  GridFilterOperator,
} from "@mui/x-data-grid";

export const statusOperators: GridFilterOperator[] = [
  {
    label: "Equals",
    value: "equals",
    getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
      if (!filterItem.field || !filterItem.value || !filterItem.operator) {
        return null;
      }

      return (params: GridCellParams): boolean => {
        return params.value === filterItem.value;
      };
    },
    InputComponent: ({ item, applyValue }: GridFilterInputValueProps) => {
      return (
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "end",
            height: 48,
            pl: "20px",
          }}
        >
          <Select
            label="Status"
            value={item.value || ""}
            onChange={(event) =>
              applyValue({ ...item, value: event.target.value })
            }
            placeholder="Select status"
            fullWidth
          >
            <MenuItem value="Inquiry">Inquiry</MenuItem>
            <MenuItem value="Onboarding">Onboarding</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Churned">Churned</MenuItem>
          </Select>
        </Box>
      );
    },
  },
];
