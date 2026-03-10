import axios, {
  type InternalAxiosRequestConfig,
  type AxiosError,
  type AxiosInstance,
} from "axios";
import { BASE_URL, REFRESH_TOKEN_API, LOGIN_API } from "../constant/api";
import {
  refreshTokenSuccess,
  logoutSuccess,
} from "../redux/services/authSlice";
import { type Store } from "@reduxjs/toolkit";

interface FailedQueueItem {
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const handleTokenRefresh = async (
  error: AxiosError,
  instance: AxiosInstance,
  store: Store,
) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  if (
    error.response?.status !== 401 ||
    !originalRequest ||
    originalRequest._retry ||
    originalRequest.url?.includes(LOGIN_API)
  ) {
    return Promise.reject(error);
  }

  if (isRefreshing) {
    return new Promise<string | null>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return instance(originalRequest);
      })
      .catch((err) => Promise.reject(err));
  }

  originalRequest._retry = true;
  isRefreshing = true;

  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    processQueue(new Error("No refresh token"), null);
    store.dispatch(logoutSuccess({ message: "Session expired" }));
    return Promise.reject(error);
  }

  try {
    const response = await axios.post(BASE_URL + REFRESH_TOKEN_API, {
      refreshToken,
    });

    const { accessToken: token, refreshToken: newRefreshToken } =
      response.data.data;

    localStorage.setItem("token", token);

    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    store.dispatch(
      refreshTokenSuccess({
        token,
        refreshToken: newRefreshToken || refreshToken,
      }),
    );

    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (originalRequest.headers) {
      originalRequest.headers["Authorization"] = `Bearer ${token}`;
    }

    processQueue(null, token);
    isRefreshing = false;

    return instance(originalRequest);
  } catch (refreshError: unknown) {
    processQueue(refreshError, null);
    isRefreshing = false;

    store.dispatch(logoutSuccess({ message: "Session expired" }));
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    return Promise.reject(refreshError);
  }
};
