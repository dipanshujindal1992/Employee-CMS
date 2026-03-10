import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Designation {
  _id: string;
  name: string;
  email?: string;
  employeeCount?: number;
}

export interface FetchDesignationsPayload {
  search?: string;
  page?: number;
  limit?: number;
}

export interface FetchDesignationsResponse {
  data: {
    data: Designation[];
    totalPages: number;
    page: number;
    total: number;
  };
  message: string;
}

export interface DesignationResponse {
  data: Designation;
  message: string;
}

export interface DesignationState {
  designations: Designation[];
  designation: Designation | null;
  totalPages: number;
  currentPage: number;
  totalCount: number;

  isFetchDesignationSuccess: boolean;
  isFetchDesignationFailure: boolean;

  isAddDesignationSuccess: boolean;
  isAddDesignationFailure: boolean;

  isUpdateDesignationSuccess: boolean;
  isUpdateDesignationFailure: boolean;

  isDeleteDesignationSuccess: boolean;
  isDeleteDesignationFailure: boolean;

  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: DesignationState = {
  designations: [],
  designation: null,
  totalPages: 1,
  currentPage: 1,
  totalCount: 0,

  isFetchDesignationSuccess: false,
  isFetchDesignationFailure: false,

  isAddDesignationSuccess: false,
  isAddDesignationFailure: false,

  isUpdateDesignationSuccess: false,
  isUpdateDesignationFailure: false,

  isDeleteDesignationSuccess: false,
  isDeleteDesignationFailure: false,

  successMessage: null,
  errorMessage: null,
};

const designationSlice = createSlice({
  name: "designation",
  initialState,
  reducers: {
    fetchDesignationsRequest(
      state,
      _action: PayloadAction<FetchDesignationsPayload>
    ) {
      state.isFetchDesignationSuccess = false;
      state.isFetchDesignationFailure = false;
      state.errorMessage = null;
    },

    fetchDesignationsSuccess(state, action: PayloadAction<FetchDesignationsResponse>) {
      state.designations = action.payload.data.data;
      state.totalPages = action.payload.data.totalPages || 1;
      state.currentPage = action.payload.data.page || 1;
      state.totalCount = action.payload.data.total || 0;
      state.isFetchDesignationSuccess = true;
      state.isFetchDesignationFailure = false;
    },

    fetchDesignationsFailure(state, action: PayloadAction<string>) {
      state.isFetchDesignationFailure = true;
      state.isFetchDesignationSuccess = false;
      state.errorMessage = action.payload;
    },

    addDesignationRequest(state, _action: PayloadAction<Partial<Designation>>) {
      state.isAddDesignationSuccess = false;
      state.isAddDesignationFailure = false;
      state.errorMessage = null;
      state.successMessage = null;
    },

    addDesignationSuccess(state, action: PayloadAction<DesignationResponse>) {
      state.isAddDesignationSuccess = true;
      state.isAddDesignationFailure = false;
      state.successMessage = action.payload.message;
      state.designations = [action.payload.data, ...state.designations];
      state.totalCount += 1;
    },

    addDesignationFailure(state, action: PayloadAction<string>) {
      state.isAddDesignationFailure = true;
      state.isAddDesignationSuccess = false;
      state.errorMessage = action.payload;
    },

    updateDesignationRequest(
      state,
      _action: PayloadAction<{ id: string; data: Partial<Designation> }>
    ) {
      state.isUpdateDesignationSuccess = false;
      state.isUpdateDesignationFailure = false;
      state.errorMessage = null;
      state.successMessage = null;
    },

    updateDesignationSuccess(state, action: PayloadAction<DesignationResponse>) {
      state.isUpdateDesignationSuccess = true;
      state.isUpdateDesignationFailure = false;
      state.successMessage = action.payload.message;

      const updatedDesignation = action.payload.data;

      if (updatedDesignation?._id) {
        state.designations = state.designations.map((item) =>
          item._id === updatedDesignation._id ? updatedDesignation : item
        );
      }
    },

    updateDesignationFailure(state, action: PayloadAction<string>) {
      state.isUpdateDesignationFailure = true;
      state.isUpdateDesignationSuccess = false;
      state.errorMessage = action.payload;
    },

    deleteDesignationRequest(state, _action: PayloadAction<string>) {
      state.isDeleteDesignationSuccess = false;
      state.isDeleteDesignationFailure = false;
      state.errorMessage = null;
      state.successMessage = null;
    },

    deleteDesignationSuccess(state, action: PayloadAction<DesignationResponse>) {
      state.isDeleteDesignationSuccess = true;
      state.isDeleteDesignationFailure = false;
      state.successMessage = action.payload.message;
      const deletedId = action.payload.data?._id;

      if (deletedId) {
        state.designations = state.designations.filter(
          (item) => item._id !== deletedId
        );
        state.totalCount -= 1;
      }
    },

    deleteDesignationFailure(state, action: PayloadAction<string>) {
      state.isDeleteDesignationFailure = true;
      state.isDeleteDesignationSuccess = false;
      state.errorMessage = action.payload;
    },

    resetDesignationFlags(state) {
      state.isFetchDesignationSuccess = false;
      state.isFetchDesignationFailure = false;

      state.isAddDesignationSuccess = false;
      state.isAddDesignationFailure = false;

      state.isUpdateDesignationSuccess = false;
      state.isUpdateDesignationFailure = false;

      state.isDeleteDesignationSuccess = false;
      state.isDeleteDesignationFailure = false;

      state.errorMessage = null;
      state.successMessage = null;
    },
  },
});

export const {
  fetchDesignationsRequest,
  fetchDesignationsSuccess,
  fetchDesignationsFailure,

  addDesignationRequest,
  addDesignationSuccess,
  addDesignationFailure,

  updateDesignationRequest,
  updateDesignationSuccess,
  updateDesignationFailure,

  deleteDesignationRequest,
  deleteDesignationSuccess,
  deleteDesignationFailure,

  resetDesignationFlags,
} = designationSlice.actions;

export default designationSlice.reducer;
