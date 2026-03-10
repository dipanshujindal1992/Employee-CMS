import { call, put, takeLatest } from "redux-saga/effects";
import { AxiosError } from "axios";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import {
  employeeAddFailure,
  employeeAddRequest,
  employeeAddSuccess,
  employeeListFailure,
  employeeListRequest,
  employeeListSuccess,
  employeeDeleteFailure,
  employeeDeleteRequest,
  employeeDeleteSuccess,
  employeeDetailsRequest,
  employeeDetailsSuccess,
  employeeDetailsFailure,
  getEmployeeListSuccess,
  getEmployeeListFailure,
  getEmployeeListRequest,
  type EmployeeDetails,
  type EmployeeListRequestPayload,
} from "../services/employeeSlice";


import { EMPLOYEE_DETAILS_API } from "../../constant/api";
import {
  EMPLOYEE_ADD_API,
  EMPLOYEE_LIST_API,
  EMPLOYEE_DELETE_API,
} from "../../constant/api";

/* ================= TYPES ================= */

interface EmployeeAddPayload {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  employeeId: string;
  dateofJoining?: string;
  workEmail?: string;
  phone?: string;
  gender?: string;
  locationId?: string;
  designationId?: string;
  departmentId?: string;
  step: number;
  // Step 2 & 3 fields
  annualCTC?: string;
  basicSalary?: string;
  fixedAllowance?: string;
  basicId?: string;
  basicAmount?: number;
  hraId?: string;
  hraAmount?: number;
  conveyanceId?: string;
  conveyanceAmount?: number;
  email?: string;
  dob?: string;
  fatherName?: string;
  pan?: string;
  adhaar?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  id?: string;
  mode?: string;
  deductions?: Array<{
    deductionId: string;
    deductionAmount: string | number;
    deductionType: "fixed" | "percentage";
    deductionEnds: "neverEnds" | "timeEnds" | "amountRecovered";
    deductionEndsValue?: string;
    deductionEndsAmountRecovered?: string;
  }>;
}

interface EmployeeAddResponse {
  success: boolean;
  message: string;
  data: {
    employeeId: string;
  };
}

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  // Add other fields as returned by list API if needed
}

interface EmployeeListResponse {
  success: boolean;
  message: string;
  data: Employee[];
}

interface EmployeeDeleteResponse {
  success: boolean;
  message: string;
}


/* ================= ADD ================= */

function* handleEmployeeAdd(action: PayloadAction<EmployeeAddPayload>) {
  try {
    const response: { data: EmployeeAddResponse } = yield call(
      api.post,
      EMPLOYEE_ADD_API,
      action.payload
    );

    yield put(
      employeeAddSuccess({
        message: response?.data?.message,
        data: response?.data?.data,
      })
    );
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    yield put(
      employeeAddFailure(
        axiosError.response?.data?.message || "Something went wrong"
      )
    );
  }
}

/* ================= LIST ================= */

function* handleEmployeeList(action: PayloadAction<EmployeeListRequestPayload>) {
  try {
    const response: { data: EmployeeListResponse } = yield call(
      api.post,
      EMPLOYEE_LIST_API,
      action.payload
    );
    yield put(employeeListSuccess(response?.data?.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    yield put(
      employeeListFailure(
        axiosError.response?.data?.message || "Failed to fetch employees"
      )
    );
  }
}
function* handleGetEmployeeList(action: PayloadAction<EmployeeListRequestPayload>) {
  try {
    const response: { data: EmployeeListResponse } = yield call(
      api.get,
      EMPLOYEE_LIST_API,
      { params: action.payload }
    );
    yield put(
      getEmployeeListSuccess({
        data: response?.data?.data,
      })
    );;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    yield put(
      getEmployeeListFailure(
        axiosError.response?.data?.message || "Failed to fetch employees"
      )
    );
  }
}
/* ================= DELETE ================= */


function* handleEmployeeDelete(action: PayloadAction<string>) {
  try {

    // Correct usage of API constant function
    const response: { data: EmployeeDeleteResponse } = yield call(api.delete, EMPLOYEE_DELETE_API(action.payload));


    yield put(employeeDeleteSuccess(response?.data));
  } catch (error: unknown) {

    const axiosError = error as AxiosError<{ message?: string }>;
    yield put(
      employeeDeleteFailure(
        axiosError.response?.data?.message || "Delete failed"
      )
    );
  }
}
/* ================= DETAILS ================= */

function* handleEmployeeDetails(action: PayloadAction<string>): Generator<unknown, void, { data: { data: EmployeeDetails } }> {
  try {
    const response = yield call(
      api.get,
      EMPLOYEE_DETAILS_API(action.payload)
    );

    yield put(employeeDetailsSuccess(response?.data?.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;

    yield put(
      employeeDetailsFailure(
        axiosError.response?.data?.message || "Failed to fetch employee details"
      )
    );
  }
}

/* ================= WATCHER ================= */

export function* watchEmployeeSaga() {
  yield takeLatest(employeeAddRequest.type, handleEmployeeAdd);
  yield takeLatest(employeeListRequest.type, handleEmployeeList);
  yield takeLatest(employeeDeleteRequest.type, handleEmployeeDelete);
  yield takeLatest(employeeDetailsRequest.type, handleEmployeeDetails);
  yield takeLatest(getEmployeeListRequest.type, handleGetEmployeeList);
}
