import axios from "axios";

// Creates api client targeting Next.js API Routes (which proxy token cookies)
const api = axios.create({
  baseURL: "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  }
});

// Response interceptor to format envelopes
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg = error.response?.data?.error?.detail || "Network request failed.";
    return Promise.reject(new Error(errorMsg));
  }
);

export default api;
