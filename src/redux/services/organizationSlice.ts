import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ===========================
   TYPES
=========================== */

export interface OrganizationData {
  id: string;
  organizationName: string;
  location: string;
  industry: string;
  dateFormat: string;
  fieldSeparator: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
  isRun: boolean;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizationApiResponse {
  message: string;
  success?: boolean;
  data: OrganizationData;
}

interface OrganizationState {
  organization: OrganizationData | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

/* ===========================
   INITIAL STATE
=========================== */

const initialState: OrganizationState = {
  organization: null,
  isLoading: false,
  error: null,
  successMessage: null,
};

/* ===========================
   SLICE
=========================== */

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    /* ========= GET ORGANIZATION ========= */

    organizationGetRequest(state) {
      state.isLoading = true;
      state.error = null;
    },

    organizationGetSuccess(
      state,
      action: PayloadAction<OrganizationApiResponse>,
    ) {
      state.isLoading = false;
      state.organization = action.payload.data;
    },

    organizationGetFailure(
      state,
      action: PayloadAction<string>,
    ) {
      state.isLoading = false;
      state.error = action.payload;
    },

    /* ========= ADD ORGANIZATION ========= */

    organizationAddDetailRequest(
      state,
      _action: PayloadAction<FormData>,
    ) {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },

    organizationAddDetailSuccess(
      state,
      action: PayloadAction<{ message: string; success?: boolean }>,
    ) {
      state.isLoading = false;
      state.successMessage = action.payload.message;
    },

    organizationAddDetailFailure(
      state,
      action: PayloadAction<string>,
    ) {
      state.isLoading = false;
      state.error = action.payload;
    },

    /* ========= RESET ========= */

    organizationResetState(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
});

/* ===========================
   EXPORTS
=========================== */

export const {
  organizationGetRequest,
  organizationGetSuccess,
  organizationGetFailure,
  organizationAddDetailRequest,
  organizationAddDetailSuccess,
  organizationAddDetailFailure,
  organizationResetState,
} = organizationSlice.actions;

export default organizationSlice.reducer;