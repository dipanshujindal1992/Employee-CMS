import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  workEmail: string;
  departmentId: {
    name: string;
  };
  designationId: {
    name: string;
  };
  dateofJoining: string;
  step?: number;
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
  fatherName?: string;
  name?: string;
}
export interface EmployeeDetails {
  employee: {
    paymentType: string;
    _id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    employeeId: string;
    gender: string;
    workEmail: string;
    phone: string;
    isActive: boolean;
    step: number;
    dateofJoining: string;
    createdAt: string;
    ctc?: number;
    departmentId: {
      _id: string;
      name: string;
    };

    designationId: {
      _id: string;
      name: string;
    };

    locationId: {
      _id: string;
      name: string;
      address1: string;
      address2: string;
      city: string;
      state: string;
      pincode: string;
    };
    step2: boolean;
  };

  personalDetail: {
    _id: string;
    employeeId: string;
    fatherName: string;
    dob: string;
    email: string;
    phone: number;
    pan: string;
    adhaar: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    pincode: string;
    createdAt: string;
    updatedAt: string;
  };

  bankDetails: {
    _id: string;
    employeeId: string;
    name: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
    type: string; // savings / current
    createdAt: string;
    updatedAt: string;
  };

  salaryDetails: {
    _id: string;
    employeeId: string;
    annualCTC: string;
    basicSalary: string;
    fixedAllowance: string;
    createdAt: string;
    updatedAt: string;
  };

  earningDetails: {
    basicId: EarningReference;
    basicAmount?: number;
    hraId?: EarningReference;
    hraAmount?: number;
    conveyanceId?: EarningReference;
    conveyanceAmount?: number;
    customAllowances?: Array<{
      customAllowanceId: string | { _id: string; earningName: string; isFlatAmount: boolean };
      customAllowanceAmount: number | string;
      customAllowanceAmountMonthly: number | string;
    }>;
    deductions?: Array<{
      _id?: string;
      deductionId: string | { _id: string; slipName: string; deductionFrequency?: string };
      deductionAmount: number | string;
      deductionType: string;
      deductionEnds?: string;
      deductionEndsValue?: string;
      deductionEndsAmountRecovered?: string | null;
      amountDeducted?: number;
    }>;
  };
}

export type EarningReference = string | { _id: string; name?: string;[key: string]: unknown };

interface EmployeeState {
  isEmployeeAddSuccess: boolean;
  isEmployeeAddFailure: boolean;
  isEmployeeDeleteSuccess: boolean;
  isEmployeeDeleteFailure: boolean;
  isEmployeeListLoading: boolean;
  isEmployeeDeleteLoading: boolean;
  successMessage: string;
  errorMessage: string;
  employeeList: Employee[];
  employeeId: string;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  employeeDetails: EmployeeDetails | null;
  isEmployeeDetailsLoading: boolean;
  getEmployeeList: Employee[];
  isGetEmployeeListLoading: boolean;
}
export interface EmployeeListRequestPayload {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

const initialState: EmployeeState = {
  isEmployeeAddSuccess: false,
  isEmployeeAddFailure: false,
  isEmployeeDeleteSuccess: false,
  isEmployeeDeleteFailure: false,
  isEmployeeListLoading: false,
  isEmployeeDeleteLoading: false,
  successMessage: "",
  errorMessage: "",
  employeeList: [],
  employeeId: "",
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  employeeDetails: null,
  isEmployeeDetailsLoading: false,
  getEmployeeList: [],
  isGetEmployeeListLoading: false,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    // ================= ADD =================
    employeeAddRequest: (state, _action) => {
      state.isEmployeeAddSuccess = false;
      state.isEmployeeAddFailure = false;
      state.successMessage = "";
      state.errorMessage = "";
    },

    employeeAddSuccess: (state, action) => {
      state.isEmployeeAddSuccess = true;
      state.successMessage = action.payload.message;
      state.employeeId = action.payload.data.employeeId;
    },

    employeeAddFailure: (state, action) => {
      state.isEmployeeAddFailure = true;
      state.errorMessage = action.payload;
    },

    // ================= LIST =================
    employeeListRequest: (
      state,
      _action: PayloadAction<EmployeeListRequestPayload>,
    ) => {
      state.isEmployeeListLoading = true;
      state.errorMessage = "";
    },

    employeeListSuccess: (state, action) => {
      state.isEmployeeListLoading = false;
      state.employeeList = action.payload.data;
      state.totalCount = action.payload.total || 0;
      state.totalPages = action.payload.totalPages || 0;
      state.currentPage = action.payload.currentPage || 1;
    },

    employeeListFailure: (state, action) => {
      state.isEmployeeListLoading = false;
      state.errorMessage = action.payload;
    },

    // ================= DELETE =================
    employeeDeleteRequest: (state, _action: PayloadAction<string>) => {
      state.isEmployeeDeleteLoading = true;
      state.isEmployeeDeleteSuccess = false;
      state.isEmployeeDeleteFailure = false;
    },

    employeeDeleteSuccess: (state, action) => {
      state.isEmployeeDeleteLoading = false;
      state.isEmployeeDeleteSuccess = true;
      state.employeeList = state.employeeList.filter(
        (emp) => emp._id !== action.payload.data._id,
      );
    },

    employeeDeleteFailure: (state, action) => {
      state.isEmployeeDeleteLoading = false;
      state.isEmployeeDeleteFailure = true;
      state.errorMessage = action.payload;
    },
    // ================= DETAILS =================
    employeeDetailsRequest: (state, _action: PayloadAction<string>) => {
      state.isEmployeeDetailsLoading = true;
      state.errorMessage = "";
    },

    employeeDetailsSuccess: (state, action) => {
      state.isEmployeeDetailsLoading = false;
      state.employeeDetails = action.payload;
    },

    employeeDetailsFailure: (state, action) => {
      state.isEmployeeDetailsLoading = false;
      state.errorMessage = action.payload;
    },

    // ================= GET EMPLOYEE LIST =================

    getEmployeeListRequest: (
      state,
      _action: PayloadAction<EmployeeListRequestPayload>,
    ) => {
      state.isGetEmployeeListLoading = true;
      state.errorMessage = "";
    },

    getEmployeeListSuccess: (state, action) => {
      state.isGetEmployeeListLoading = false;
      state.getEmployeeList = action.payload.data;
    },

    getEmployeeListFailure: (state, action) => {
      state.isGetEmployeeListLoading = false;
      state.errorMessage = action.payload;
    },

    employeeReset: (state) => {
      state.isEmployeeAddSuccess = false;
      state.isEmployeeAddFailure = false;
      state.isEmployeeDeleteSuccess = false;
      state.isEmployeeDeleteFailure = false;
      state.isEmployeeDeleteLoading = false;
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
});

export const {
  employeeAddRequest,
  employeeAddSuccess,
  employeeAddFailure,
  employeeListRequest,
  employeeListSuccess,
  employeeListFailure,
  employeeDeleteRequest,
  employeeDeleteSuccess,
  employeeDeleteFailure,
  employeeDetailsRequest,
  employeeDetailsSuccess,
  employeeDetailsFailure,
  employeeReset,
  getEmployeeListRequest,
  getEmployeeListSuccess,
  getEmployeeListFailure,
} = employeeSlice.actions;

export default employeeSlice.reducer;
