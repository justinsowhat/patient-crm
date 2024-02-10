import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useGetPatients } from "../hooks";
import { Patient } from "../../../shared/types";

const columns: GridColDef[] = [
  { field: "firstName", headerName: "First name", width: 200 },
  { field: "lastName", headerName: "Last name", width: 200 },
  { field: "dob", headerName: "Date of Birth", width: 120 },
  { field: "status", headerName: "Status", width: 120 },
];

export const PatientsTable = () => {
  const [rows, setRows] = useState<Patient[]>([]);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "lastName", sort: "asc" },
  ]);

  const { data, isLoading } = useGetPatients({
    paginationModel,
    sortModel,
  });

  useEffect(() => {
    setRows(data?.data || []);
    setTotalRowCount(data?.total || 0);
  }, [data]);

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      loading={isLoading}
      pagination
      paginationMode="server"
      onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
      rowCount={totalRowCount} // Set the total row count here
      sortingMode="server"
      sortModel={sortModel}
      onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
    />
  );
};
