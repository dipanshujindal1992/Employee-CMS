import { call, put, takeLatest } from "redux-saga/effects";
import { AxiosError } from "axios";
import api from "../../api/api";
import {
  createDeductionFailure,
  createDeductionRequest,
  createDeductionSuccess,
  deductionListFailure,
  deductionListRequest,
  deductionListSuccess,
  recurringDeductionListFailure,
  recurringDeductionListRequest,
  recurringDeductionListSuccess,
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
  type Deduction,
} from "../services/deductionSlice";
import {
  DEDUCTION_ADD_API,
  DEDUCTION_LIST_API,
  DEDUCTION_UPDATE_API,
  DEDUCTION_DELETE_API,
  DEDUCTION_STATUS_API,
  DEDUCTION_GET_API,
  DEDUCTION_LIST_RECURRING_API,
  DEDUCTION_ADD_EMPLOYEE_API,
  DEDUCTION_UPDATE_EMPLOYEE_API,
  DEDUCTION_DELETE_EMPLOYEE_API,
} from "../../constant/api";

/* ================= ADD DEDUCTION ================= */

function* handleAddDeduction(action: ReturnType<typeof createDeductionRequest>) {
  try {
    const response: { data: { message: string; data: Deduction } } = yield call(
      api.post,
      DEDUCTION_ADD_API,
      action.payload
    );
    yield put(createDeductionSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    yield put(
      createDeductionFailure(axiosError.response?.data?.message || "Add deduction failed")
    );
    return false;
  }
}

function* handleDeductionList(action: ReturnType<typeof deductionListRequest>) {
  try {
    const response: { data: { data: { data: Deduction[]; totalPages: number; total: number } } } = yield call(
      api.post,
      DEDUCTION_LIST_API,
      action.payload
    );
    yield put(deductionListSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    yield put(
      deductionListFailure(
        axiosError.response?.data?.message || "Get deduction failed"
      )
    );
  }
}

function* handleRecurringDeductionList() {
  try {
    const response: { data: { data: Deduction[] } } = yield call(
      api.post,
      DEDUCTION_LIST_RECURRING_API
    );
    yield put(recurringDeductionListSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    yield put(
      recurringDeductionListFailure(
        axiosError.response?.data?.message || "Get recurring deductions failed"
      )
    );
  }
}

function* handleUpdateDeduction(action: ReturnType<typeof updateDeductionRequest>) {
  try {
    const response: { data: { message: string; data: Deduction } } = yield call(
      api.put,
      DEDUCTION_UPDATE_API(action.payload.id),
      action.payload.data
    );
    yield put(updateDeductionSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    yield put(
      updateDeductionFailure(
        axiosError.response?.data?.message || "Update deduction failed"
      )
    );
  }
}

function* handleDeleteDeduction(action: ReturnType<typeof deleteDeductionRequest>) {
  try {
    yield call(api.delete, DEDUCTION_DELETE_API(action.payload));
    yield put(deleteDeductionSuccess(action.payload));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    yield put(
      deleteDeductionFailure(
        axiosError.response?.data?.message || "Delete deduction failed"
      )
    );
  }
}

function* handleUpdateDeductionStatus(action: ReturnType<typeof updateDeductionStatusRequest>) {
  try {
    const response: { data: { message: string; data: Deduction } } = yield call(
      api.patch,
      DEDUCTION_STATUS_API(action.payload.id),
      { isActive: action.payload.isActive }
    );
    yield put(updateDeductionStatusSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    yield put(
      updateDeductionStatusFailure(
        axiosError.response?.data?.message || "Update deduction status failed"
      )
    );
  }
}

function* handleGetDeductionData(action: ReturnType<typeof getDeductionDataRequest>) {
  try {
    const response: { data: { data: Deduction } } = yield call(
      api.get,
      DEDUCTION_GET_API(action.payload)
    );
    yield put(getDeductionDataSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    yield put(
      getDeductionDataFailure(
        axiosError.response?.data?.message || "Fetch deduction details failed"
      )
    );
  }
}

/* ================= ADD/UPDATE EMPLOYEE DEDUCTION ================= */

function* handleAddEmployeeDeduction(action: ReturnType<typeof addEmployeeDeductionRequest>) {
  try {
    const response: { data: { message: string } } = yield call(
      api.post,
      DEDUCTION_ADD_EMPLOYEE_API,
      action.payload
    );
    yield put(addEmployeeDeductionSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    yield put(
      addEmployeeDeductionFailure(
        axiosError.response?.data?.message || "Add employee deduction failed"
      )
    );
  }
}

function* handleUpdateEmployeeDeduction(action: ReturnType<typeof updateEmployeeDeductionRequest>) {
  try {
    const response: { data: { message: string } } = yield call(
      api.put,
      DEDUCTION_UPDATE_EMPLOYEE_API(action.payload.id),
      action.payload.data
    );
    yield put(updateEmployeeDeductionSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    yield put(
      updateEmployeeDeductionFailure(
        axiosError.response?.data?.message || "Update employee deduction failed"
      )
    );
  }
}

function* handleDeleteEmployeeDeduction(action: ReturnType<typeof deleteEmployeeDeductionRequest>) {
  try {
    const response: { data: { message: string } } = yield call(
      api.delete,
      DEDUCTION_DELETE_EMPLOYEE_API(action.payload.deductionId),
      { data: { employeeId: action.payload.employeeId } }
    );
    yield put(deleteEmployeeDeductionSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    yield put(
      deleteEmployeeDeductionFailure(
        axiosError.response?.data?.message || "Delete employee deduction failed"
      )
    );
  }
}

/* ================= WATCHER ================= */

export function* watchDeductionSaga() {
  yield takeLatest(createDeductionRequest.type, handleAddDeduction);
  yield takeLatest(deductionListRequest.type, handleDeductionList);
  yield takeLatest(recurringDeductionListRequest.type, handleRecurringDeductionList);
  yield takeLatest(updateDeductionRequest.type, handleUpdateDeduction);
  yield takeLatest(deleteDeductionRequest.type, handleDeleteDeduction);
  yield takeLatest(updateDeductionStatusRequest.type, handleUpdateDeductionStatus);
  yield takeLatest(getDeductionDataRequest.type, handleGetDeductionData);
  yield takeLatest(addEmployeeDeductionRequest.type, handleAddEmployeeDeduction);
  yield takeLatest(updateEmployeeDeductionRequest.type, handleUpdateEmployeeDeduction);
  yield takeLatest(deleteEmployeeDeductionRequest.type, handleDeleteEmployeeDeduction);
}