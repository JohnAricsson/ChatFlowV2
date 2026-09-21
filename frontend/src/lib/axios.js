import axios from "axios";

const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : import.meta.env.VITE_BACKEND_URL ||
      "https://chatflowv2-backend.onrender.com";

export const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
});
