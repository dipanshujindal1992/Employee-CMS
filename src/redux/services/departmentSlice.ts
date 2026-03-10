import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Department {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  email?: string;
  employeeCount?: number;
}

export interface FetchDepartmentsPayload {
  search?: string;
  page?: number;
  limit?: number;
}

export interface FetchDepartmentsResponse {
  data: {
    data: Department[];
    totalPages: number;
    page: number;
    total: number;
  };
  message: string;
}

export interface DepartmentResponse {
  data: Department;
  message: string;
}

export interface DepartmentState {
  departments: Department[];
  department: Department | null;

  totalPages: number;
  currentPage: number;
  totalCount: number;

  isFetchDepartmentSuccess: boolean;
  isFetchDepartmentFailure: boolean;

  isAddDepartmentSuccess: boolean;
  isAddDepartmentFailure: boolean;

  isUpdateDepartmentSuccess: boolean;
  isUpdateDepartmentFailure: boolean;

  isDeleteDepartmentSuccess: boolean;
  isDeleteDepartmentFailure: boolean;

  successMessage: string | null;
  errorMessage: string | null;
}

const initialState: DepartmentState = {
  departments: [],
  department: null,

  totalPages: 1,
  currentPage: 1,
  totalCount: 0,

  isFetchDepartmentSuccess: false,
  isFetchDepartmentFailure: false,

  isAddDepartmentSuccess: false,
  isAddDepartmentFailure: false,

  isUpdateDepartmentSuccess: false,
  isUpdateDepartmentFailure: false,

  isDeleteDepartmentSuccess: false,
  isDeleteDepartmentFailure: false,

  successMessage: null,
  errorMessage: null,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    fetchDepartmentsRequest(
      state,
      _action: PayloadAction<FetchDepartmentsPayload>
    ) {
      state.isFetchDepartmentSuccess = false;
      state.isFetchDepartmentFailure = false;
      state.errorMessage = null;
    },

    fetchDepartmentsSuccess(state, action: PayloadAction<FetchDepartmentsResponse>) {
      state.departments = action.payload.data.data;
      state.totalPages = action.payload.data.totalPages || 1;
      state.currentPage = action.payload.data.page || 1;
      state.totalCount = action.payload.data.total || 0;
      state.isFetchDepartmentSuccess = true;
      state.isFetchDepartmentFailure = false;
    },

    fetchDepartmentsFailure(state, action: PayloadAction<string>) {
      state.isFetchDepartmentFailure = true;
      state.isFetchDepartmentSuccess = false;
      state.errorMessage = action.payload;
    },

    addDepartmentRequest(state, _action: PayloadAction<Partial<Department>>) {
      state.isAddDepartmentSuccess = false;
      state.isAddDepartmentFailure = false;
      state.errorMessage = null;
      state.successMessage = null;
    },

    addDepartmentSuccess(state, action: PayloadAction<DepartmentResponse>) {
      state.isAddDepartmentSuccess = true;
      state.isAddDepartmentFailure = false;
      state.successMessage = action.payload.message;
      state.departments = [action.payload.data, ...state.departments];
      state.totalCount += 1;
    },

    addDepartmentFailure(state, action: PayloadAction<string>) {
      state.isAddDepartmentFailure = true;
      state.isAddDepartmentSuccess = false;
      state.errorMessage = action.payload;
    },

    updateDepartmentRequest(
      state,
      _action: PayloadAction<{ id: string; data: Partial<Department> }>
    ) {
      state.isUpdateDepartmentSuccess = false;
      state.isUpdateDepartmentFailure = false;
      state.errorMessage = null;
      state.successMessage = null;
    },

    updateDepartmentSuccess(state, action: PayloadAction<DepartmentResponse>) {
      state.isUpdateDepartmentSuccess = true;
      state.isUpdateDepartmentFailure = false;
      state.successMessage = action.payload.message;

      const updatedDepartment = action.payload.data;

      if (updatedDepartment?._id) {
        state.departments = state.departments.map((item) =>
          item._id === updatedDepartment._id ? updatedDepartment : item
        );
      }
    },

    updateDepartmentFailure(state, action: PayloadAction<string>) {
      state.isUpdateDepartmentFailure = true;
      state.isUpdateDepartmentSuccess = false;
      state.errorMessage = action.payload;
    },

    deleteDepartmentRequest(state, _action: PayloadAction<string>) {
      state.isDeleteDepartmentSuccess = false;
      state.isDeleteDepartmentFailure = false;
      state.errorMessage = null;
      state.successMessage = null;
    },

    deleteDepartmentSuccess(state, action: PayloadAction<DepartmentResponse>) {
      state.isDeleteDepartmentSuccess = true;
      state.isDeleteDepartmentFailure = false;
      state.successMessage = action.payload.message;

      const deletedId = action.payload.data?._id;

      if (deletedId) {
        state.departments = state.departments.filter(
          (item) => item._id !== deletedId
        );
        state.totalCount -= 1;
      }
    },

    deleteDepartmentFailure(state, action: PayloadAction<string>) {
      state.isDeleteDepartmentFailure = true;
      state.isDeleteDepartmentSuccess = false;
      state.errorMessage = action.payload;
    },

    resetDepartmentFlags(state) {
      state.isFetchDepartmentSuccess = false;
      state.isFetchDepartmentFailure = false;

      state.isAddDepartmentSuccess = false;
      state.isAddDepartmentFailure = false;

      state.isUpdateDepartmentSuccess = false;
      state.isUpdateDepartmentFailure = false;

      state.isDeleteDepartmentSuccess = false;
      state.isDeleteDepartmentFailure = false;

      state.errorMessage = null;
      state.successMessage = null;
    },
  },
});

export const {
  fetchDepartmentsRequest,
  fetchDepartmentsSuccess,
  fetchDepartmentsFailure,

  addDepartmentRequest,
  addDepartmentSuccess,
  addDepartmentFailure,

  updateDepartmentRequest,
  updateDepartmentSuccess,
  updateDepartmentFailure,

  deleteDepartmentRequest,
  deleteDepartmentSuccess,
  deleteDepartmentFailure,

  resetDepartmentFlags,
} = departmentSlice.actions;

export default departmentSlice.reducer;
