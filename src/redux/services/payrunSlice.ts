import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* ===========================
   TYPES
=========================== */

export interface PayrunItem {
  _id: string;
  type: string;
  date: string;
  earningId: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  employeeCount?: number;
  netPay?: number;
}

export interface PaySchedule {
  _id?: string;
  totalEmployees: number;
  totalPayable: number;
  cycle: string;
}

export interface PayrunEmployee {
  _id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  name?: string;
}

export interface PayrunDetailItem {
  _id: string;
  payRunId: string;
  employeeId: PayrunEmployee;
  grosPay: number;
  deduction: number;
  netPay: number;
  amount?: number; // Used in some contexts for display
  createdAt?: string;
  updatedAt?: string;
}

export interface PayrunListApiResponse {
  message: string;
  success?: boolean;
  paySchedule?: PaySchedule;
  data: PayrunItem[];
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

export interface PayrunAddApiResponse {
  message: string;
  success?: boolean;
  data?: PayrunItem;
}

interface PayrunState {
  payrunList: PayrunItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  payrunEmployeeList: PayrunEmployee[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  payrunDetailsList: PayrunDetailItem[];
  detailsTotalCount: number;
  detailsTotalPages: number;
  detailsCurrentPage: number;
  payrunAddDetail: PayrunItem | null;
  paySchedule: PaySchedule | null;
}
export interface PayrunEmployeeListApiResponse {
  message: string;
  success?: boolean;
  data: PayrunEmployee[]; // replace with proper employee type later
}

interface PayrunDetailsListApiResponse {
  message: string;
  success?: boolean;
  data: PayrunDetailItem[];
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
}
/* ===========================
   INITIAL STATE
=========================== */

const initialState: PayrunState = {
  payrunList: [],
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  payrunEmployeeList: [],
  isLoading: false,
  error: null,
  successMessage: null,
  payrunDetailsList: [],
  detailsTotalCount: 0,
  detailsTotalPages: 0,
  detailsCurrentPage: 1,
  payrunAddDetail: null,
  paySchedule: null,
};
/* ===========================
   SLICE
=========================== */

const payrunSlice = createSlice({
  name: "payrun",
  initialState,
  reducers: {
    /* ========= GET PAYRUN LIST ========= */

    payrunListRequest(state, _action: PayloadAction<{ page?: number; limit?: number }>) {
      state.isLoading = true;
      state.error = null;
    },

    payrunListSuccess(
      state,
      action: PayloadAction<PayrunListApiResponse>,
    ) {
      state.isLoading = false;
      state.payrunList = action.payload.data || [];
      state.totalCount = action.payload.total || 0;
      state.totalPages = action.payload.totalPages || 0;
      state.currentPage = action.payload.currentPage || 1;
      state.paySchedule = action.payload.paySchedule || null;
    },

    payrunListFailure(
      state,
      action: PayloadAction<string>,
    ) {
      state.isLoading = false;
      state.error = action.payload;
    },

    /* ========= ADD PAYRUN ========= */

    payrunAddRequest(
      state,
      _action: PayloadAction<{
        type: string;
        date: string;
        earningId: string;
      }>,
    ) {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
      state.payrunAddDetail = null;
    },

    payrunAddSuccess(
      state,
      action: PayloadAction<PayrunAddApiResponse>,
    ) {
      state.isLoading = false;
      state.successMessage = action.payload.message;
      state.payrunAddDetail = action.payload.data || null;
    },

    payrunAddFailure(
      state,
      action: PayloadAction<string>,
    ) {
      state.isLoading = false;
      state.error = action.payload;
    },
    /* ========= ADD EMPLOYEE TO PAYRUN ========= */

    payrunEmployeeAddRequest(
      state,
      _action: PayloadAction<{
        payRunId: string;
        type: string;
        employeeId: string;
        netPay?: number;
      }>
    ) {
      state.isLoading = true;
      state.error = null;
    },

    payrunEmployeeAddSuccess(
      state,
      action: PayloadAction<{ message: string; data?: PayrunDetailItem }>
    ) {
      state.isLoading = false;
      state.successMessage = action.payload.message;
      if (action.payload.data) {
        // Append the locally added employee item directly to the detailed list
        state.payrunDetailsList = [...state.payrunDetailsList, action.payload.data];
      }
    },

    payrunEmployeeAddFailure(
      state,
      action: PayloadAction<string>
    ) {
      state.isLoading = false;
      state.error = action.payload;
    },
    /* ========= PAYRUN EMPLOYEE LIST ========= */

    payrunEmployeeListRequest(
      state,
      _action: PayloadAction<{ page: number; limit: number }>
    ) {
      state.isLoading = true;
      state.error = null;
    },

    payrunEmployeeListSuccess(
      state,
      action: PayloadAction<PayrunEmployeeListApiResponse>
    ) {
      state.isLoading = false;
      state.payrunEmployeeList = action.payload.data;
    },

    payrunEmployeeListFailure(
      state,
      action: PayloadAction<string>
    ) {
      state.isLoading = false;
      state.error = action.payload;
    },
    payrunResetState(state) {
      state.error = null;
      state.successMessage = null;
    },
    /* ========= DELETE PAYRUN ========= */

    payrunDeleteRequest(
      state,
      _action: PayloadAction<{ id: string }>
    ) {
      state.isLoading = true;
      state.error = null;
    },

    payrunDeleteSuccess(
      state,
      action: PayloadAction<{ message: string }>
    ) {
      state.isLoading = false;
      state.successMessage = action.payload.message;
    },

    payrunDeleteFailure(
      state,
      action: PayloadAction<string>
    ) {
      state.isLoading = false;
      state.error = action.payload;
    },
    payrunDetailsListRequest(
      state,
      _action: PayloadAction<{ page: number; limit: number, payRunId: string }>
    ) {
      state.isLoading = true;
      state.error = null;
    },

    payrunDetailsListSuccess(
      state,
      action: PayloadAction<PayrunDetailsListApiResponse>
    ) {
      state.isLoading = false;
      state.payrunDetailsList = action.payload.data;
      state.detailsTotalCount = action.payload.totalCount || 0;
      state.detailsTotalPages = action.payload.totalPages || 0;
      state.detailsCurrentPage = action.payload.currentPage || 1;
    },

    payrunDetailsListFailure(
      state,
      action: PayloadAction<string>
    ) {
      state.isLoading = false;
      state.error = action.payload;
    },
    payrunRemoveEmployeeRequest(
      state,
      action: PayloadAction<string> // ID of the employee to remove
    ) {
      state.isLoading = true;
      state.error = null;
      // Optimistically remove from details list right away for faster UI response
      if (state.payrunDetailsList) {
        state.payrunDetailsList = state.payrunDetailsList.filter(
          (emp: PayrunDetailItem) => emp._id !== action.payload
        );
      }
    },

    payrunRemoveEmployeeSuccess(
      state,
      action: PayloadAction<{ message: string }>
    ) {
      state.isLoading = false;
      state.successMessage = action.payload.message;
    },

    payrunRemoveEmployeeFailure(
      state,
      action: PayloadAction<string>
    ) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createPayrunRequest(state, _action) {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },
    createPayrunSuccess(state, action: PayloadAction<{ message: string; data?: PayrunItem }>) {
      state.isLoading = false;
      state.successMessage = action.payload.message;
    },
    createPayrunFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    }

  },
});

/* ===========================
   EXPORTS
=========================== */

export const {
  payrunListRequest,
  payrunListSuccess,
  payrunListFailure,
  payrunAddRequest,
  payrunAddSuccess,
  payrunAddFailure,
  payrunResetState,
  payrunEmployeeAddRequest,
  payrunEmployeeAddSuccess,
  payrunEmployeeAddFailure,
  payrunEmployeeListRequest,
  payrunEmployeeListSuccess,
  payrunEmployeeListFailure,
  payrunDeleteRequest,
  payrunDeleteSuccess,
  payrunDeleteFailure,
  payrunDetailsListRequest,
  payrunDetailsListSuccess,
  payrunDetailsListFailure,
  payrunRemoveEmployeeRequest,
  payrunRemoveEmployeeSuccess,
  payrunRemoveEmployeeFailure,
  createPayrunRequest,
  createPayrunSuccess,
  createPayrunFailure
} = payrunSlice.actions;

export default payrunSlice.reducer;