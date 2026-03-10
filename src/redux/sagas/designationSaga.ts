import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import api from "../../api/api";

import {
  addDesignationRequest,
  addDesignationSuccess,
  addDesignationFailure,
  updateDesignationRequest,
  updateDesignationSuccess,
  updateDesignationFailure,
  deleteDesignationRequest,
  deleteDesignationSuccess,
  deleteDesignationFailure,
  fetchDesignationsFailure,
  fetchDesignationsSuccess,
  fetchDesignationsRequest,
  type FetchDesignationsPayload,
  type FetchDesignationsResponse,
  type DesignationResponse,
  type Designation,
} from "../services/designationSlice";

import {
  DESIGNATION_LIST_API,
  DESIGNATION_ADD_API,
  DESIGNATION_UPDATE_API,
  DESIGNATION_DELETE_API,
} from "../../constant/api";

function* fetchDesignations(
  action: PayloadAction<FetchDesignationsPayload>
): Generator {
  try {
    const response = (yield call(
      api.post,
      DESIGNATION_LIST_API,
      action.payload
    )) as { data: FetchDesignationsResponse };
    yield put(fetchDesignationsSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "Failed to fetch designations";

    yield put(fetchDesignationsFailure(message));
  }
}

function* addDesignation(
  action: PayloadAction<Partial<Designation>>
): Generator {
  try {
    const response = (yield call(
      api.post,
      DESIGNATION_ADD_API,
      action.payload
    )) as { data: DesignationResponse };

    yield put(addDesignationSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "Failed to add designation";

    yield put(addDesignationFailure(message));
  }
}

function* updateDesignation(
  action: PayloadAction<{ id: string; data: Partial<Designation> }>
): Generator {
  try {
    const { id, data } = action.payload;
    const url = DESIGNATION_UPDATE_API(id);

    const response = (yield call(api.put, url, data)) as {
      data: DesignationResponse;
    };

    yield put(updateDesignationSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "Failed to update designation";

    yield put(updateDesignationFailure(message));
  }
}

function* deleteDesignation(action: PayloadAction<string>): Generator {
  try {
    const id = action.payload;
    const url = DESIGNATION_DELETE_API(id);
    const response = (yield call(api.delete, url)) as {
      data: DesignationResponse;
    };

    yield put(deleteDesignationSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "Failed to delete designation";

    yield put(deleteDesignationFailure(message));
  }
}

export default function* designationSaga() {
  yield takeLatest(fetchDesignationsRequest.type, fetchDesignations);
  yield takeLatest(addDesignationRequest.type, addDesignation);
  yield takeLatest(updateDesignationRequest.type, updateDesignation);
  yield takeLatest(deleteDesignationRequest.type, deleteDesignation);
}
