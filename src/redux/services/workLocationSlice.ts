// src/store/workLocation/workLocationSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface WorkLocation {
  _id: string;
  name: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  pincode: string;
  employeeCount?: number;
}

export interface WorkLocationState {
  workLocations: WorkLocation[];

  isFetchWorkLocationSuccess: boolean;
  isFetchWorkLocationFailure: boolean;

  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: WorkLocationState = {
  workLocations: [],

  isFetchWorkLocationSuccess: false,
  isFetchWorkLocationFailure: false,

  successMessage: null,
  errorMessage: null,
};

const workLocationSlice = createSlice({
  name: "workLocation",
  initialState,
  reducers: {
    fetchWorkLocationsRequest(
      state,
      _action: PayloadAction<{
        search?: string;
        page?: number;
        limit?: number;
      }>,
    ) {
      state.isFetchWorkLocationSuccess = false;
      state.isFetchWorkLocationFailure = false;
      state.errorMessage = null;
    },

    fetchWorkLocationsSuccess(state, action: PayloadAction<any>) {
      state.workLocations = action.payload.data.data;
      state.isFetchWorkLocationSuccess = true;
      state.isFetchWorkLocationFailure = false;
    },

    fetchWorkLocationsFailure(state, action: PayloadAction<string>) {
      state.isFetchWorkLocationFailure = true;
      state.isFetchWorkLocationSuccess = false;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  fetchWorkLocationsRequest,
  fetchWorkLocationsSuccess,
  fetchWorkLocationsFailure,
} = workLocationSlice.actions;

export default workLocationSlice.reducer;
