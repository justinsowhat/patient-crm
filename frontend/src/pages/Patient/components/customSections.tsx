import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { CustomSection } from "../../../shared/types";
import { useCreateCustomSection } from "../hooks/useCreateCustomSection";
import { useCreateCustomField } from "../hooks/useCreateCustomField";

type CustomSectionsProps = {
  editEnabled: boolean;
  customSections?: CustomSection[];
};

export interface CustomSectionsRef {
  getCustomSections: () => CustomSection[];
}

export const CustomSections = forwardRef<
  CustomSectionsRef,
  CustomSectionsProps
>((props, ref) => {
  const [sections, setSections] = useState<CustomSection[]>(
    props.customSections || []
  );

  const [openSectionDialog, setOpenSectionDialog] = useState(false);
  const [openFieldDialog, setOpenFieldDialog] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number | null>(
    null
  );
  const [newSectionName, setNewSectionName] = useState("");
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "number">("text");

  const handleAddSection = async () => {
    setNewSectionName("");
    setOpenSectionDialog(false);
    const response = await useCreateCustomSection({
      name: newSectionName,
      fields: [],
    });
    if (response?.data) setSections([...sections, response?.data]);
  };

  const handleAddField = async () => {
    if (currentSectionIndex !== null) {
      const updatedSections = [...sections];

      const newField = {
        name: newFieldName,
        dataType: newFieldType,
        value: "",
      };

      updatedSections[currentSectionIndex].fields.push(newField);
      setSections(updatedSections);

      setNewFieldName("");
      setNewFieldType("text");
      setOpenFieldDialog(false);

      await useCreateCustomField(
        updatedSections[currentSectionIndex].id || "",
        newField
      );
    }
  };

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    sectionIndex: number,
    fieldIndex: number
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].fields[fieldIndex].value = event.target.value;
    setSections(updatedSections);
  };

  useImperativeHandle(ref, () => ({
    getCustomSections: () => sections,
  }));

  return (
    <Box>
      {sections.map((section, index) => (
        <Box key={index} sx={{ marginY: "20px" }}>
          <Typography variant="h6" fontWeight={600}>
            {section.name}
          </Typography>
          <Grid container spacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {section.fields?.map((field, fieldIndex) => (
              <Grid key={fieldIndex} item xs={4}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type={field.dataType}
                  label={field.name}
                  variant="outlined"
                  margin="normal"
                  onChange={(e) => handleFieldChange(e, index, fieldIndex)}
                  value={field.value}
                  disabled={!props.editEnabled}
                />
              </Grid>
            ))}
          </Grid>
          {props.editEnabled && (
            <Button
              onClick={() => {
                setCurrentSectionIndex(index);
                setOpenFieldDialog(true);
              }}
              sx={{ marginTop: "20px" }}
            >
              Add Field
            </Button>
          )}
        </Box>
      ))}

      {props.editEnabled && (
        <Button
          sx={{ marginTop: "20px" }}
          onClick={() => setOpenSectionDialog(true)}
        >
          Add Section
        </Button>
      )}

      <Dialog
        open={openSectionDialog}
        onClose={() => setOpenSectionDialog(false)}
      >
        <DialogTitle>Add a new section</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Section Name"
            fullWidth
            variant="outlined"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSectionDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSection}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openFieldDialog} onClose={() => setOpenFieldDialog(false)}>
        <DialogTitle>Add a new field</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Field Name"
            fullWidth
            variant="outlined"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={newFieldType}
              label="Type"
              onChange={(e) =>
                setNewFieldType(e.target.value as "text" | "number")
              }
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFieldDialog(false)}>Cancel</Button>
          <Button onClick={handleAddField}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});
