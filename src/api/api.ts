import axios from "axios";
import { BASE_URL } from "../constant/api";
import { handleTokenRefresh } from "./refreshHandler";

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const setupInterceptors = (store: any) => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => handleTokenRefresh(error, instance, store)
  );
};

export default instance;