import { useQuery } from "react-query";
import { parseToken, useAxios } from "../../../shared";
import { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { Patient } from "../../../shared/types";

type GetPatientsParams = {
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
};

type PaginatedResponse<ResponseType> = {
  data: ResponseType[];
  page: number;
  total: number;
};

export const useGetPatients = ({
  paginationModel,
  sortModel,
}: GetPatientsParams) => {
  const axios = useAxios();
  const { userId } = parseToken();

  const getPatients = async () => {
    return await axios.get<PaginatedResponse<Patient>>("patients", {
      params: {
        provider_id: userId,
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sort: sortModel.map((s) => s.field).join(","),
        order: sortModel.map((s) => s.sort).join(","),
      },
    });
  };

  return useQuery<PaginatedResponse<Patient>, Error>(
    ["patients", { ...paginationModel, ...sortModel }],
    async () => {
      const response = await getPatients();
      return response.data;
    }
  );
};
