import { call, put, takeLatest } from "redux-saga/effects";
import {
  signInRequest,
  signInSuccess,
  signInFailure,
  signUpRequest,
  signUpSuccess,
  signUpFailure,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  otpVerifyRequest,
  otpVerifySuccess,
  otpVerifyFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  organizationAddRequest,
  organizationAddSuccess,
  organizationAddFailure,
  type AuthData,
} from "../services/authSlice";

import {
  LOGIN_API,
  SIGNUP_API,
  FORGOT_PASSWORD_API,
  OTP_VERIFY_API,
  RESET_PASSWORD_API,
  LOGOUT_API,
  CHANGE_PASSWORD_API,
  ORGANIZATION_ADD_API,

  REFRESH_TOKEN_API,
} from "../../constant/api";

import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { AxiosError, type AxiosResponse } from "axios";

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  state: string;
}

interface ForgotPayload {
  email: string;
}

interface OtpPayload {
  otp: string;
  email: string;
}

interface ResetPayload {
  password: string;
  email: string;
  newPassword: string;
}

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

interface RefreshPayload {
  refreshToken: string;
}

interface AuthApiResponse {
  message: string;
  data: AuthData;
  success?: boolean;
}
type OrganizationAddPayload = FormData;

export function* handleSignIn(action: PayloadAction<LoginPayload>): Generator {
  try {
    const response = (yield call(
      api.post,
      LOGIN_API,
      action.payload,
    )) as AxiosResponse<AuthApiResponse>;

    const data = response?.data?.data;
    if (data?.token) {
      localStorage.setItem("token", data.token);
    }

    if (data?.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    yield put(signInSuccess(response?.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message = axiosError.response?.data?.message || "Login failed";

    yield put(signInFailure(message));
  }
}

export function* handleSignup(action: PayloadAction<SignupPayload>): Generator {
  try {
    const response = (yield call(
      api.post,
      SIGNUP_API,
      action.payload,
    )) as AxiosResponse<AuthApiResponse>;

    yield put(signUpSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message = axiosError.response?.data?.message || "Signup failed";

    yield put(signUpFailure(message));
  }
}

export function* handleForgotPassword(
  action: PayloadAction<ForgotPayload>,
): Generator {
  try {
    const response = (yield call(
      api.post,
      FORGOT_PASSWORD_API,
      action.payload,
    )) as AxiosResponse<AuthApiResponse>;

    yield put(forgotPasswordSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "Forgot password failed";

    yield put(forgotPasswordFailure(message));
  }
}

export function* handleOtpVerify(action: PayloadAction<OtpPayload>): Generator {
  try {
    const response = (yield call(
      api.post,
      OTP_VERIFY_API,
      action.payload,
    )) as AxiosResponse<AuthApiResponse>;

    yield put(otpVerifySuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "OTP verification failed";
    yield put(otpVerifyFailure(message));
  }
}

export function* handleResetPassword(
  action: PayloadAction<ResetPayload>,
): Generator {
  try {
    const response = (yield call(
      api.post,
      RESET_PASSWORD_API,
      action.payload,
    )) as AxiosResponse<AuthApiResponse>;

    yield put(resetPasswordSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "Reset password failed";

    yield put(resetPasswordFailure(message));
  }
}

export function* handleLogout(): Generator {
  try {
    const response = (yield call(
      api.post,
      LOGOUT_API,
    )) as AxiosResponse<AuthApiResponse>;

    yield put(logoutSuccess(response.data));

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message = axiosError.response?.data?.message || "Logout failed";

    yield put(logoutFailure(message));
  }
}

export function* handleChangePassword(
  action: PayloadAction<ChangePasswordPayload>,
): Generator {
  try {
    const response = (yield call(
      api.post,
      CHANGE_PASSWORD_API,
      action.payload,
    )) as AxiosResponse<AuthApiResponse>;

    yield put(changePasswordSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "Change password failed";

    yield put(changePasswordFailure(message));
  }
}

export function* handleRefreshToken(
  action: PayloadAction<RefreshPayload>,
): Generator {
  try {
    const response = (yield call(
      api.post,
      REFRESH_TOKEN_API,
      action.payload,
    )) as AxiosResponse<AuthApiResponse>;

    const data = response?.data?.data;
    const token = data?.token;
    const refreshToken = data?.refreshToken;

    if (token) {
      localStorage.setItem("token", token);
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    yield put(
      refreshTokenSuccess({
        token,
        refreshToken,
      }),
    );
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "Token refresh failed";

    yield put(refreshTokenFailure(message));

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    yield put(logoutSuccess({ message: "Session expired" }));
  }
}
export function* handleOrganizationAdd(
  action: PayloadAction<OrganizationAddPayload>,
): Generator {
  try {
    const response = (yield call(
      api.post,
      ORGANIZATION_ADD_API,
      action.payload
    )) as AxiosResponse<{ message: string; success?: boolean }>;

    yield put(organizationAddSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "Organization add failed";

    yield put(organizationAddFailure(message));
  }
}

export default function* authSaga() {
  yield takeLatest(signInRequest.type, handleSignIn);
  yield takeLatest(signUpRequest.type, handleSignup);
  yield takeLatest(forgotPasswordRequest.type, handleForgotPassword);
  yield takeLatest(otpVerifyRequest.type, handleOtpVerify);
  yield takeLatest(resetPasswordRequest.type, handleResetPassword);
  yield takeLatest(logoutRequest.type, handleLogout);
  yield takeLatest(changePasswordRequest.type, handleChangePassword);
  yield takeLatest(refreshTokenRequest.type, handleRefreshToken);
  yield takeLatest(organizationAddRequest.type, handleOrganizationAdd);
}
