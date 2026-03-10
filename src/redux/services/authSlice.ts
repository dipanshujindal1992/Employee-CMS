import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  provider?: string;
  isVerified?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  organizationAdded?: boolean;
  type?: number;
  googleId?: string | null;
  otp?: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  organisationId?: string;
  role?: string;
}

export interface AuthData extends User {
  token: string;
  refreshToken?: string;
  userId: string;
}

export interface AuthState {
  successMessage: string | null;
  errorMessage: string | null;

  isLoginSuccess: boolean;
  isLoginFailure: boolean;

  isSignupSuccess: boolean;
  isSignupFailure: boolean;

  isForgotSuccess: boolean;
  isForgotFailure: boolean;

  isResetSuccess: boolean;
  isResetFailure: boolean;

  isOtpSuccess: boolean;
  isOtpFailure: boolean;

  isLogoutSuccess: boolean;
  isLogoutFailure: boolean;

  isChangePasswordSuccess: boolean;
  isChangePasswordFailure: boolean;
  userData: AuthData | null;
  isRefreshSuccess: boolean;
  isRefreshFailure: boolean;
  isAuthenticated: boolean;
  isOrganizationAddSuccess: boolean;
  isOrganizationAddFailure: boolean;
  userId: string;
}

const initialState: AuthState = {
  successMessage: null,
  errorMessage: null,
  userData: null,
  isLoginSuccess: false,
  isLoginFailure: false,

  isSignupSuccess: false,
  isSignupFailure: false,

  isForgotSuccess: false,
  isForgotFailure: false,

  isResetSuccess: false,
  isResetFailure: false,

  isOtpSuccess: false,
  isOtpFailure: false,

  isLogoutSuccess: false,
  isLogoutFailure: false,

  isChangePasswordSuccess: false,
  isChangePasswordFailure: false,
  isRefreshSuccess: false,
  isRefreshFailure: false,
  isAuthenticated: false,
  isOrganizationAddSuccess: false,
  isOrganizationAddFailure: false,
  userId: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ---------------- SIGN IN ----------------
    signInRequest(
      state,
      _action: PayloadAction<{ email: string; password: string }>,
    ) {
      state.successMessage = null;
      state.errorMessage = null;
      state.isLoginSuccess = false;
      state.isLoginFailure = false;
      state.isAuthenticated = false;
    },
    signInSuccess(
      state,
      action: PayloadAction<{ message: string; data: AuthData }>,
    ) {
      state.isLoginSuccess = true;
      state.name = action.payload.data.name;
      state.successMessage = action.payload.message;
      state.userData = action.payload.data;
      state.isAuthenticated = true;
    },
    signInFailure(state, action: PayloadAction<string>) {
      state.isLoginFailure = true;
      state.errorMessage = action.payload;
    },

    // ---------------- SIGN UP ----------------
    signUpRequest(
      state,
      _action: PayloadAction<{
        name: string;
        email: string;
        phone: string;
        password: string;
        country: string;
        state: string;
      }>,
    ) {
      state.successMessage = null;
      state.errorMessage = null;
      state.isSignupSuccess = false;
      state.isSignupFailure = false;
      state.isAuthenticated = false;
    },
    signUpSuccess(state, action: PayloadAction<{ message: string }>) {
      state.isSignupSuccess = true;
      state.successMessage = action.payload.message;
    },
    signUpFailure(state, action: PayloadAction<string>) {
      state.isSignupFailure = true;
      state.errorMessage = action.payload;
    },

    // ---------------- FORGOT PASSWORD ----------------
    forgotPasswordRequest(state, _action: PayloadAction<{ email: string }>) {
      state.successMessage = null;
      state.errorMessage = null;
      state.isForgotSuccess = false;
      state.isForgotFailure = false;
    },
    forgotPasswordSuccess(state, action: PayloadAction<{ message: string }>) {
      state.isForgotSuccess = true;
      state.successMessage = action.payload.message;
    },
    forgotPasswordFailure(state, action: PayloadAction<string>) {
      state.isForgotFailure = true;
      state.errorMessage = action.payload;
    },

    // ---------------- OTP VERIFY ----------------
    otpVerifyRequest(
      state,
      _action: PayloadAction<{ otp: string; email: string }>,
    ) {
      state.successMessage = null;
      state.errorMessage = null;
      state.isOtpSuccess = false;
      state.isOtpFailure = false;
    },
    otpVerifySuccess(
      state,
      action: PayloadAction<{ message: string; data: AuthData }>,
    ) {
      state.isOtpSuccess = true;
      state.successMessage = action.payload.message;
      state.userId = action.payload.data.userId;
    },
    otpVerifyFailure(state, action: PayloadAction<string>) {
      state.isOtpFailure = true;
      state.errorMessage = action.payload;
    },

    // ---------------- RESET PASSWORD ----------------
    resetPasswordRequest(
      state,
      _action: PayloadAction<{
        password: string;
        email: string;
        newPassword: string;
      }>,
    ) {
      state.successMessage = null;
      state.errorMessage = null;
      state.isResetSuccess = false;
      state.isResetFailure = false;
    },
    resetPasswordSuccess(state, action: PayloadAction<{ message: string }>) {
      state.isResetSuccess = true;
      state.successMessage = action.payload.message;
    },
    resetPasswordFailure(state, action: PayloadAction<string>) {
      state.isResetFailure = true;
      state.errorMessage = action.payload;
    },

    // ---------------- LOGOUT ----------------
    logoutRequest(state) {
      state.successMessage = null;
      state.errorMessage = null;
      state.isLogoutSuccess = false;
      state.isLogoutFailure = false;
    },
    logoutSuccess(state, action: PayloadAction<{ message: string }>) {
      Object.assign(state, initialState);
      state.isLogoutSuccess = true;
      state.successMessage = action.payload.message;
    },
    logoutFailure(state, action: PayloadAction<string>) {
      state.isLogoutFailure = true;
      state.errorMessage = action.payload;
    },

    // ---------------- CHANGE PASSWORD ----------------
    changePasswordRequest(
      state,
      _action: PayloadAction<{ oldPassword: string; newPassword: string }>,
    ) {
      state.successMessage = null;
      state.errorMessage = null;
      state.isChangePasswordSuccess = false;
      state.isChangePasswordFailure = false;
    },
    changePasswordSuccess(state, action: PayloadAction<{ message: string }>) {
      state.isChangePasswordSuccess = true;
      state.successMessage = action.payload.message;
    },
    changePasswordFailure(state, action: PayloadAction<string>) {
      state.isChangePasswordFailure = true;
      state.errorMessage = action.payload;
    }, // ---------------- ORGANIZATION ADD ----------------
    organizationAddRequest(
      state,
      _action: PayloadAction<FormData>,
    ) {
      state.successMessage = null;
      state.errorMessage = null;
      state.isOrganizationAddSuccess = false;
      state.isOrganizationAddFailure = false;
    },

    organizationAddSuccess(state, action: PayloadAction<{ message: string }>) {
      state.isOrganizationAddSuccess = true;
      state.successMessage = action.payload.message;

      // Optional: update user flag
      if (state.userData) {
        state.userData.organizationAdded = true;
      }
    },

    organizationAddFailure(state, action: PayloadAction<string>) {
      state.isOrganizationAddFailure = true;
      state.errorMessage = action.payload;
    },

    refreshTokenRequest(
      state,
      _action: PayloadAction<{ refreshToken: string }>,
    ) {
      state.successMessage = null;
      state.errorMessage = null;
      state.isRefreshSuccess = false;
      state.isRefreshFailure = false;
    },

    refreshTokenSuccess(
      state,
      action: PayloadAction<{
        token: string;
        refreshToken?: string;
      }>,
    ) {
      state.isRefreshSuccess = true;

      if (state.userData) {
        state.userData.token = action.payload.token;
        if (action.payload.refreshToken) {
          state.userData.refreshToken = action.payload.refreshToken;
        }
      }
    },

    refreshTokenFailure(state, action: PayloadAction<string>) {
      state.isRefreshFailure = true;
      state.errorMessage = action.payload;
    },
    // RESET FLAGS
    resetAuthFlags(state) {
      state.successMessage = null;
      state.errorMessage = null;
      state.isLoginSuccess = false;
      state.isLoginFailure = false;
      state.isSignupSuccess = false;
      state.isSignupFailure = false;
      state.isForgotSuccess = false;
      state.isForgotFailure = false;
      state.isResetSuccess = false;
      state.isResetFailure = false;
      state.isOtpSuccess = false;
      state.isOtpFailure = false;
      state.isLogoutSuccess = false;
      state.isLogoutFailure = false;
      state.isChangePasswordSuccess = false;
      state.isChangePasswordFailure = false;
      state.isRefreshSuccess = false;
      state.isRefreshFailure = false;
      state.isOrganizationAddSuccess = false;
      state.isOrganizationAddFailure = false;
    },
  },
});

export const {
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
  organizationAddRequest,
  organizationAddSuccess,
  organizationAddFailure,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,
  resetAuthFlags,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
} = authSlice.actions;

export default authSlice.reducer;
