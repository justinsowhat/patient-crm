import {
  DataGrid,
  GridColDef,
  GridFilterOperator,
  getGridDateOperators,
  getGridStringOperators,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useGetPatients } from "../hooks";
import { Patient } from "../../../shared/types";
import { statusOperators } from "./filterOperators";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";

// to simply the problem -- only allow "contains" filter for strings
const subsetStringOperators: GridFilterOperator[] =
  getGridStringOperators().filter((operator) => operator.value === "contains");

export const PatientsTable = () => {
  const [rows, setRows] = useState<Patient[]>([]);

  const { data, isLoading } = useGetPatients();

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterOperators: [],
      renderCell: (params) => {
        const navigate = useNavigate();
        const handleClick = () => {
          const id = params.id;
          navigate(`/patient/${id}`);
        };

        return <Button onClick={handleClick}>View</Button>;
      },
    },
    {
      field: "firstName",
      headerName: "First name",
      width: 200,
      filterOperators: subsetStringOperators,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 200,
      filterOperators: subsetStringOperators,
    },
    {
      field: "dob",
      headerName: "Date of Birth",
      width: 120,
      filterOperators: getGridDateOperators(),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      filterOperators: statusOperators,
    },
  ];

  useEffect(() => {
    setRows(data?.data || []);
  }, [data]);

  // TODO: at some point we want to do server-side pagination/sorting/filtering if data set grows too large and load time becomes a concern
  // But for this project, we use client-side operations to make it simpler
  return (
    <DataGrid
      style={{ flex: 1, overflow: "auto" }}
      rows={rows}
      columns={columns}
      loading={isLoading}
    />
  );
};
