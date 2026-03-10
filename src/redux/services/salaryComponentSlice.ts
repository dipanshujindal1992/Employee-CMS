import { createSlice, type PayloadAction} from "@reduxjs/toolkit";

export interface SalaryCategory {
  _id: string;
  name: string;
  description?: string;
  status?: string;
  isActive?: boolean;
}

export interface EarningType {
  _id: string;
  name: string;
  description?: string;
  status?: string;
  isActive?: boolean;
}

interface SalaryComponentState {
  salaryCategories: SalaryCategory[];
  isFetchSalaryCategorySuccess: boolean;
  isFetchSalaryCategoryFailure: boolean;
  errorMessage: string | null;
  earningTypes: EarningType[];
  isFetchEarningTypeSuccess: boolean;
  isFetchEarningTypeFailure: boolean;
}

const initialState: SalaryComponentState = {
  salaryCategories: [],
  earningTypes: [],
  isFetchSalaryCategorySuccess: false,
  isFetchSalaryCategoryFailure: false,
  errorMessage: null,
  
  isFetchEarningTypeSuccess: false,
  isFetchEarningTypeFailure: false,
};

export interface FetchSalaryCategoryPayload {
  search?: string;
  page?: number;
  limit?: number;
}

const salaryComponentSlice = createSlice({
  name: "salaryComponent",
  initialState,
  reducers: {
    fetchSalaryCategoryRequest(
      state,
      _action: PayloadAction<FetchSalaryCategoryPayload>
    ) {
      state.isFetchSalaryCategorySuccess = false;
      state.isFetchSalaryCategoryFailure = false;
      state.errorMessage = null;
    },

    fetchSalaryCategorySuccess(state, action: PayloadAction<{ data: SalaryCategory[] }>) {
      state.salaryCategories = action.payload.data;
      state.isFetchSalaryCategorySuccess = true;
      state.isFetchSalaryCategoryFailure = false;
    
    },

    fetchSalaryCategoryFailure(state, action: PayloadAction<string>) {
      state.isFetchSalaryCategoryFailure = true;
      state.isFetchSalaryCategorySuccess = false;
      state.errorMessage = action.payload;
    }, fetchEarningTypeRequest(state) {
      state.isFetchEarningTypeSuccess = false;
      state.isFetchEarningTypeFailure = false;
      state.errorMessage = null;
    },

    fetchEarningTypeSuccess(state, action: PayloadAction<{ data: EarningType[] }>) {
      state.earningTypes = action.payload.data;
      state.isFetchEarningTypeSuccess = true;
      state.isFetchEarningTypeFailure = false;
    },

    fetchEarningTypeFailure(state, action: PayloadAction<string>) {
      state.isFetchEarningTypeFailure = true;
      state.isFetchEarningTypeSuccess = false;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  fetchSalaryCategoryRequest,
  fetchSalaryCategorySuccess,
  fetchSalaryCategoryFailure,
   fetchEarningTypeRequest,
  fetchEarningTypeSuccess,
  fetchEarningTypeFailure
} = salaryComponentSlice.actions;

export default salaryComponentSlice.reducer;
