import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Earning {
  _id: string;
  name: string;
  code: string;
  description?: string;
  status?: string;
  isActive?: boolean;
  amount?: number;
  isFlatAmount?: boolean;
  earningName?: string;
  slipName?: string;
  earningType?: string;
  earningId?: string | { _id: string; name: string };
  categoryId?: string;
}
// Earningadd is redundant, but keeping as alias if needed or removing
export type EarningAddPayload = Partial<Earning>;
export interface FetchEarningsPayload {
  search?: string;
  page?: number;
  limit?: number;
}

export interface FetchEarningsResponse {
  data: {
    data: Earning[];
    totalPages: number;
    page: number;
    total?: number;
  };
  message: string;
}

export interface EarningResponse {
  message: string;
  data: Earning;
}

export interface EarningState {
  earnings: Earning[];
  earning: Earning | null;

  isAddSuccess: boolean;
  isAddFailure: boolean;
  isLoading: boolean;

  isFetchSuccess: boolean;
  isFetchFailure: boolean;

  isUpdateSuccess: boolean;
  isUpdateFailure: boolean;

  isDeleteSuccess: boolean;
  isDeleteFailure: boolean;

  isStatusUpdateSuccess: boolean;
  isStatusUpdateFailure: boolean;

  successMessage: string | null;
  errorMessage: string | null;
  totalPages: number;
  currentPage: number;
  salaryEarningList: Earning[];

  isSalaryListLoading: boolean;
  isSalaryListSuccess: boolean;
  isSalaryListFailure: boolean;
  total: number;
}

const initialState: EarningState = {
  earnings: [],
  earning: null,

  totalPages: 1,
  currentPage: 1,

  isAddSuccess: false,
  isAddFailure: false,
  isLoading: false,
  salaryEarningList: [],

  isSalaryListLoading: false,
  isSalaryListSuccess: false,
  isSalaryListFailure: false,
  isFetchSuccess: false,
  isFetchFailure: false,

  isUpdateSuccess: false,
  isUpdateFailure: false,

  isDeleteSuccess: false,
  isDeleteFailure: false,

  isStatusUpdateSuccess: false,
  isStatusUpdateFailure: false,

  successMessage: null,
  errorMessage: null,
  total: 0,
};

const earningSlice = createSlice({
  name: "earning",
  initialState,
  reducers: {
    addEarningRequest(state, _action: PayloadAction<EarningAddPayload>) {
      state.isAddSuccess = false;
      state.errorMessage = null;
      state.isLoading = true; 
    },
    addEarningSuccess(
      state,
      action: PayloadAction<{ message: string; data: Earning }>,
    ) {
      state.isAddSuccess = true;
      state.successMessage = action.payload.message;
      state.earnings = [action.payload.data, ...state.earnings];
    },
    addEarningFailure(state, action: PayloadAction<string>) {
      state.isAddFailure = true;
      state.errorMessage = action.payload;
    },

    fetchEarningByIdRequest(state, _action: PayloadAction<string>) {
      state.isFetchSuccess = false;
      state.errorMessage = null;
    },
    fetchEarningByIdSuccess(state, action: PayloadAction<{ data: Earning }>) {
      state.isFetchSuccess = true;
      state.earning = action.payload.data;
    },
    fetchEarningByIdFailure(state, action: PayloadAction<string>) {
      state.isFetchFailure = true;
      state.errorMessage = action.payload;
    },

    updateEarningRequest(
      state,
      _action: PayloadAction<{ id: string; data: Partial<Earning> }>,
    ) {
      state.isUpdateSuccess = false;
      state.errorMessage = null;
    },
    updateEarningSuccess(
      state,
      action: PayloadAction<{ message: string; data: Earning }>,
    ) {
      state.isUpdateSuccess = true;
      state.successMessage = action.payload.message;

      const updated = action.payload.data;
      state.earnings = state.earnings.map((item) =>
        item._id === updated._id ? updated : item,
      );
    },
    updateEarningFailure(state, action: PayloadAction<string>) {
      state.isUpdateFailure = true;
      state.errorMessage = action.payload;
    },

    updateEarningStatusRequest(
      state,
      _action: PayloadAction<{ id: string; data: Partial<Earning> }>,
    ) {
      state.isStatusUpdateSuccess = false;
      state.errorMessage = null;
    },
    updateEarningStatusSuccess(
      state,
      action: PayloadAction<{ message: string; data: Earning }>,
    ) {
      state.isStatusUpdateSuccess = true;
      state.successMessage = action.payload.message;

      const updated = action.payload.data;
      state.earnings = state.earnings.map((item) =>
        item._id === updated._id ? updated : item,
      );
    },
    updateEarningStatusFailure(state, action: PayloadAction<string>) {
      state.isStatusUpdateFailure = true;
      state.errorMessage = action.payload;
    },

    deleteEarningRequest(state, _action: PayloadAction<string>) {
      state.isDeleteSuccess = false;
      state.errorMessage = null;
    },
    deleteEarningSuccess(
      state,
      action: PayloadAction<{ message: string; data: { _id: string } }>,
    ) {
      state.isDeleteSuccess = true;
      state.successMessage = action.payload.message;

      const deletedId = action.payload.data?._id;
      state.earnings = state.earnings.filter((item) => item._id !== deletedId);
    },
    deleteEarningFailure(state, action: PayloadAction<string>) {
      state.isDeleteFailure = true;
      state.errorMessage = action.payload;
    },
    fetchEarningsRequest(
      state,
      _action: PayloadAction<FetchEarningsPayload>,
    ) {
      state.isLoading = true;
      state.isFetchSuccess = false;
      state.isFetchFailure = false;
      state.errorMessage = null;
    },

    fetchEarningsSuccess(
      state,
      action: PayloadAction<FetchEarningsResponse>,
    ) {
      state.isLoading = false;
      state.isFetchSuccess = true;
      state.isFetchFailure = false;
      state.earnings = action.payload.data.data || [];
      state.totalPages = action.payload.data.totalPages || 1;
      state.currentPage = action.payload.data.page || 1;
      state.total = action.payload.data.total || 0;
    },

    fetchEarningsFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.isFetchFailure = true;
      state.isFetchSuccess = false;
      state.errorMessage = action.payload;
    },
    fetchSalaryEarningListRequest(state) {
      state.isSalaryListLoading = true;
      state.isSalaryListSuccess = false;
      state.isSalaryListFailure = false;
      state.errorMessage = null;
    },

    fetchSalaryEarningListSuccess(
      state,
      action: PayloadAction<{ message: string; data: Earning[] }>
    ) {
      state.isSalaryListLoading = false;
      state.isSalaryListSuccess = true;
      state.salaryEarningList = action.payload.data || [];
    },

    fetchSalaryEarningListFailure(state, action: PayloadAction<string>) {
      state.isSalaryListLoading = false;
      state.isSalaryListFailure = true;
      state.errorMessage = action.payload;
    },

    resetEarningFlags(state) {
      state.isAddSuccess = false;
      state.isAddFailure = false;
      state.isFetchSuccess = false;
      state.isFetchFailure = false;
      state.isUpdateSuccess = false;
      state.isUpdateFailure = false;
      state.isDeleteSuccess = false;
      state.isDeleteFailure = false;
      state.isStatusUpdateSuccess = false;
      state.isStatusUpdateFailure = false;
      state.errorMessage = null;
      state.successMessage = null;
      state.isSalaryListSuccess = false;
      state.isSalaryListFailure = false;
    },
  },
});


export const {
  addEarningRequest,
  addEarningSuccess,
  addEarningFailure,
  fetchSalaryEarningListRequest,
  fetchSalaryEarningListSuccess,
  fetchSalaryEarningListFailure,
  fetchEarningByIdRequest,
  fetchEarningByIdSuccess,
  fetchEarningByIdFailure,

  updateEarningRequest,
  updateEarningSuccess,
  updateEarningFailure,

  updateEarningStatusRequest,
  updateEarningStatusSuccess,
  updateEarningStatusFailure,

  deleteEarningRequest,
  deleteEarningSuccess,
  deleteEarningFailure,

  fetchEarningsRequest,
  fetchEarningsSuccess,
  fetchEarningsFailure,

  resetEarningFlags,
} = earningSlice.actions;

export default earningSlice.reducer;
