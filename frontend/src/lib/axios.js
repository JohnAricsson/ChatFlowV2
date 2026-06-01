import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatflowv2-backend.onrender.com/api",
  withCredentials: true,
});
