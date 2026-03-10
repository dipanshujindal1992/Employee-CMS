import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";

import {
  addDepartmentRequest,
  addDepartmentSuccess,
  addDepartmentFailure,
  updateDepartmentRequest,
  updateDepartmentSuccess,
  updateDepartmentFailure,
  deleteDepartmentRequest,
  deleteDepartmentSuccess,
  deleteDepartmentFailure,
  fetchDepartmentsFailure,
  fetchDepartmentsSuccess,
  fetchDepartmentsRequest,
} from "../services/departmentSlice";

import {
  DEPARTMENT_LIST_API,
  DEPARTMENT_ADD_API,
  DEPARTMENT_UPDATE_API,
  DEPARTMENT_DELETE_API,
} from "../../constant/api";

// =====================
// Fetch Departments
// =====================
function* fetchDepartments(
  action: PayloadAction<{ search?: string; page?: number; limit?: number }>
): Generator {
  try {
    const response = yield call(
      api.post,
      DEPARTMENT_LIST_API,
      action.payload
    );

    yield put(fetchDepartmentsSuccess(response.data));
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err?.response?.data?.message || "Failed to fetch departments";

    yield put(fetchDepartmentsFailure(message));
  }
}

// =====================
// Add Department
// =====================
function* addDepartment(action: PayloadAction<unknown>): Generator {
  try {
    const response = yield call(
      api.post,
      DEPARTMENT_ADD_API,
      action.payload
    );

    yield put(addDepartmentSuccess(response.data));
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err?.response?.data?.message || "Failed to add department";

    yield put(addDepartmentFailure(message));
  }
}

// =====================
// Update Department
// =====================
function* updateDepartment(action: PayloadAction<{ id: string; data: Record<string, unknown> }>): Generator {
  try {
    const { id, data } = action.payload;
    const url = DEPARTMENT_UPDATE_API(id);

    const response = yield call(api.put, url, data);

    yield put(updateDepartmentSuccess(response.data));
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err?.response?.data?.message || "Failed to update department";

    yield put(updateDepartmentFailure(message));
  }
}

// =====================
// Delete Department
// =====================
function* deleteDepartment(action: PayloadAction<string>): Generator {
  try {
    const id = action.payload;
    const url = DEPARTMENT_DELETE_API(id);

    const response = yield call(api.delete, url);

    yield put(deleteDepartmentSuccess(response.data));
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err?.response?.data?.message || "Failed to delete department";

    yield put(deleteDepartmentFailure(message));
  }
}

// =====================
// Watcher Saga
// =====================
export default function* departmentSaga() {
  yield takeLatest(fetchDepartmentsRequest.type, fetchDepartments);
  yield takeLatest(addDepartmentRequest.type, addDepartment);
  yield takeLatest(updateDepartmentRequest.type, updateDepartment);
  yield takeLatest(deleteDepartmentRequest.type, deleteDepartment);
}
