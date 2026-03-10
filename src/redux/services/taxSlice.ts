import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ===========================
   TYPES
=========================== */

export interface TaxData {
  id?: string;
  pan?: string;
  tan?: string;
  tdsCircle?: string;
  aoCode?: string;
  rangeCode?: string;
  aoType?: string;
  taxPaymentFrequency?: string;
  deductorType?: string;
  isEmployee?: boolean;
  deductorName?: string;
  deductorFatherName?: string;
  deductorDesignation?: string;
  taxPercentage?: number;
  taxName?: string;
  tds?: string;
  name?: string;
  fatherName?: string;
  designation?: string;
  createdAt?: string;
  updatedAt?: string;
  employeeId?: string | null;
}

export interface TaxApiResponse {
  message: string;
  success?: boolean;
  data?: TaxData;
}

interface TaxState {
  tax: TaxData | null;
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}

/* ===========================
   INITIAL STATE
=========================== */

const initialState: TaxState = {
  tax: null,
  isLoading: false,
  errorMessage: null,
  successMessage: null,
};

/* ===========================
   SLICE
=========================== */

const taxSlice = createSlice({
  name: "tax",
  initialState,
  reducers: {
    /* ========= GET TAX ========= */
    taxGetRequest(state) {
      state.isLoading = true;
      state.errorMessage = null;
    },
    taxGetSuccess(state, action: PayloadAction<TaxApiResponse>) {
      state.isLoading = false;
      state.tax = action.payload.data || null;
    },
    taxGetFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },

    /* ========= SET TAX ========= */
    taxSetRequest(state, _action: PayloadAction<Omit<TaxData, 'id' | 'createdAt' | 'updatedAt'>>) {
      state.isLoading = true;
      state.errorMessage = null;
      state.successMessage = null;
    },
    taxSetSuccess(state, action: PayloadAction<{ message: string; success?: boolean }>) {
      state.isLoading = false;
      state.successMessage = action.payload.message;
    },
    taxSetFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },

    /* ========= RESET ========= */
    taxResetState(state) {
      state.errorMessage = null;
      state.successMessage = null;
    },
  },
});

/* ===========================
   EXPORTS
=========================== */

export const {
  taxGetRequest,
  taxGetSuccess,
  taxGetFailure,
  taxSetRequest,
  taxSetSuccess,
  taxSetFailure,
  taxResetState,
} = taxSlice.actions;

export default taxSlice.reducer;