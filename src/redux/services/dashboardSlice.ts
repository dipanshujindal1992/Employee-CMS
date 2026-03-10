import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ComponentDetails_Type = {
  isEmployeeComplete: boolean;
  isOrganizationComplete: boolean;
  isPayrollComplete: boolean;
  isSalaryComplete: boolean;
  isTaxComplete: boolean;
  isPayScheduleComplete: boolean;
};

export interface DashboardData {
  data: {
    completionDetails: ComponentDetails_Type;
    totalEmployee: number;
    activeEmployee: number;
    inActiveEmployee: number;
    pendingEmployee: number;
  };

  message: string;
}

interface DashboardState {
  isLoading: boolean;
  data: DashboardData["data"] | null;
  successMessage: string;
  errorMessage: string;
}

const initialState: DashboardState = {
  isLoading: false,
  data: null,
  successMessage: "",
  errorMessage: "",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    dashboardDataRequest: (state) => {
      state.isLoading = true;
      state.successMessage = "";
      state.errorMessage = "";
    },
    dashboardDataSuccess: (state, action: PayloadAction<DashboardData>) => {
      state.isLoading = false;
      state.data = action.payload.data;
      state.successMessage = action.payload.message;
      state.errorMessage = "";
    },
    dashboardDataFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    dashboardReset: (state) => {
      state.isLoading = false;
      state.data = null;
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
});

export const {
  dashboardDataRequest,
  dashboardDataSuccess,
  dashboardDataFailure,
  dashboardReset,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
