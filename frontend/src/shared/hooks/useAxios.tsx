import axios from "axios";
import { API_URL } from "../../config";

const userToken = window.localStorage.getItem("access_token") || "";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${userToken}`,
  },
});

export const useAxios = () => {
  return axiosInstance;
};
