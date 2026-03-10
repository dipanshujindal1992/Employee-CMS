
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Deduction {
  _id: string;
  categoryId: string;
  slipName: string;
  deductionFrequency: "oneTime" | "recurring";
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
interface DeductionResponse {
  data: Deduction[];
  totalPages: number;
  total: number;
}
export interface CreateDeductionPayload {
  categoryId: string;
  slipName: string;
  deductionFrequency: "oneTime" | "recurring";
  isActive: boolean;
}

export interface UpdateDeductionPayload {
  id: string;
  data: Partial<CreateDeductionPayload>;
}

export interface AddEmployeeDeductionPayload {
  employeeId: string;
  deductionId?: string;
  slipName?: string;
  categoryId?: string;
  deductionAmount: number | string;
  deductionType: "fixed" | "percentage";
  deductionEnds: "neverEnds" | "timeEnds" | "amountRecovered";
  deductionEndsValue?: string;
  deductionEndsAmountRecovered?: number | string;
}

export interface UpdateEmployeeDeductionPayload {
  id: string;
  data: Omit<AddEmployeeDeductionPayload, "deductionId">;
}

export interface DeleteEmployeeDeductionPayload {
  employeeId: string;
  deductionId: string;
}

export interface DeductionListPayload {
  search?: string;
  page?: number;
  limit?: number;
}

export interface DeductionState {
  loading: boolean;
  deductionList: Deduction[];
  totalPages: number;
  successMessage: string | null;
  errorMessage: string | null;
  total: number;
  singleDeduction: Deduction | null;
  recurringDeductionList: Deduction[];
}
const initialState: DeductionState = {
  loading: false,
  deductionList: [],
  totalPages: 1,
  total: 0,
  successMessage: null,
  errorMessage: null,
  singleDeduction: null,
  recurringDeductionList: [],
};

const deductionSlice = createSlice({
  name: "deduction",
  initialState,
  reducers: {
    createDeductionRequest: (
      state,
      _action: PayloadAction<CreateDeductionPayload>
    ) => {
      state.loading = true;
      state.successMessage = null;
      state.errorMessage = null;
    },

    createDeductionSuccess: (
      state,
      action: PayloadAction<{ message: string; data: Deduction }>
    ) => {
      state.loading = false;
      state.deductionList.push(action.payload.data);
      state.successMessage = action.payload.message || "Deduction created successfully";
    },

    createDeductionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },



    updateDeductionRequest: (state, _action: PayloadAction<UpdateDeductionPayload>) => {
      state.loading = true;
      state.successMessage = null;
      state.errorMessage = null;
    },
    updateDeductionSuccess: (
      state,
      action: PayloadAction<{ message: string; data: Deduction }>
    ) => {
      state.loading = false;
      const updated = action.payload.data;
      const index = state.deductionList.findIndex((d) => d._id === updated._id);
      if (index !== -1) {
        state.deductionList[index] = updated;
      }
      state.successMessage = action.payload.message || "Deduction updated successfully";
    },
    updateDeductionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },

    deleteDeductionRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.successMessage = null;
      state.errorMessage = null;
    },
    deleteDeductionSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.deductionList = state.deductionList.filter((d) => d._id !== action.payload);
      state.successMessage = "Deduction deleted successfully";
    },
    deleteDeductionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },
    deductionListRequest: (state, _action: PayloadAction<DeductionListPayload>) => {
      state.loading = true;
      state.errorMessage = null;
    },
    deductionListSuccess: (
      state,
      action: PayloadAction<{ data: DeductionResponse }>
    ) => {
      state.loading = false;
      state.deductionList = action.payload.data.data || [];
      state.totalPages = action.payload.data.totalPages || 1;
      state.total = action.payload.data.total || 0;

    },

    deductionListFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },

    addEmployeeDeductionRequest: (state, _action: PayloadAction<AddEmployeeDeductionPayload>) => {
      state.loading = true;
      state.successMessage = null;
      state.errorMessage = null;
    },
    addEmployeeDeductionSuccess: (state, action: PayloadAction<{ message: string }>) => {
      state.loading = false;
      state.successMessage = action.payload.message || "Deduction added to employee successfully";
    },
    addEmployeeDeductionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },

    updateEmployeeDeductionRequest: (state, _action: PayloadAction<UpdateEmployeeDeductionPayload>) => {
      state.loading = true;
      state.successMessage = null;
      state.errorMessage = null;
    },
    updateEmployeeDeductionSuccess: (state, action: PayloadAction<{ message: string }>) => {
      state.loading = false;
      state.successMessage = action.payload.message || "Employee deduction updated successfully";
    },
    updateEmployeeDeductionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },

    deleteEmployeeDeductionRequest: (state, _action: PayloadAction<DeleteEmployeeDeductionPayload>) => {
      state.loading = true;
      state.successMessage = null;
      state.errorMessage = null;
    },
    deleteEmployeeDeductionSuccess: (state, action: PayloadAction<{ message: string }>) => {
      state.loading = false;
      state.successMessage = action.payload.message || "Employee deduction deleted successfully";
    },
    deleteEmployeeDeductionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },

    recurringDeductionListRequest: (state) => {
      state.loading = true;
      state.errorMessage = null;
    },
    recurringDeductionListSuccess: (
      state,
      action: PayloadAction<{ data: Deduction[] }>
    ) => {
      state.loading = false;
      // Handle nested Axios wrapper to prevent array iterators from crashing Component rendering
      state.recurringDeductionList = (action.payload.data as any)?.data || action.payload.data || [];
    },
    recurringDeductionListFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },

    updateDeductionStatusRequest: (
      state,
      _action: PayloadAction<{ id: string; isActive: boolean }>
    ) => {
      state.loading = true;
      state.successMessage = null;
      state.errorMessage = null;
    },
    updateDeductionStatusSuccess: (
      state,
      action: PayloadAction<{ message: string; data: Deduction }>
    ) => {
      state.loading = false;
      const updated = action.payload.data;
      const index = state.deductionList.findIndex((d) => d._id === updated._id);
      if (index !== -1) {
        state.deductionList[index] = updated;
      }
      state.successMessage = action.payload.message || "Deduction status updated successfully";
    },
    updateDeductionStatusFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },
    getDeductionDataRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.singleDeduction = null;
    },
    getDeductionDataSuccess: (state, action: PayloadAction<{ data: Deduction }>) => {
      state.loading = false;
      state.singleDeduction = action.payload.data;
    },
    getDeductionDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },
    clearDeductionMessages: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
    },
  },
});

export const {
  createDeductionRequest,
  createDeductionSuccess,
  createDeductionFailure,
  deductionListRequest,
  deductionListSuccess,
  deductionListFailure,
  recurringDeductionListRequest,
  recurringDeductionListSuccess,
  recurringDeductionListFailure,
  updateDeductionRequest,
  updateDeductionSuccess,
  updateDeductionFailure,
  deleteDeductionRequest,
  deleteDeductionSuccess,
  deleteDeductionFailure,
  updateDeductionStatusRequest,
  updateDeductionStatusSuccess,
  updateDeductionStatusFailure,
  getDeductionDataRequest,
  getDeductionDataSuccess,
  getDeductionDataFailure,
  addEmployeeDeductionRequest,
  addEmployeeDeductionSuccess,
  addEmployeeDeductionFailure,
  updateEmployeeDeductionRequest,
  updateEmployeeDeductionSuccess,
  updateEmployeeDeductionFailure,
  deleteEmployeeDeductionRequest,
  deleteEmployeeDeductionSuccess,
  deleteEmployeeDeductionFailure,
  clearDeductionMessages,
} = deductionSlice.actions;

export default deductionSlice.reducer;