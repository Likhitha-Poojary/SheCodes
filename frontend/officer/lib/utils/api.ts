import axios from "axios";

const api = axios.create({
  baseURL: "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  }
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg = error.response?.data?.error?.detail || "Network request failed.";
    return Promise.reject(new Error(errorMsg));
  }
);

export default api;
