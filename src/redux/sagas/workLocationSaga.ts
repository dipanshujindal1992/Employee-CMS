import { call, put, takeLatest } from "redux-saga/effects";
import { WORK_LOCATION_LIST_API } from "../../constant/api";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchWorkLocationsFailure,
  fetchWorkLocationsRequest,
  fetchWorkLocationsSuccess,
} from "../services/workLocationSlice";

import api from "../../api/api";

function* fetchWorkLocations(
  action: PayloadAction<{ search?: string; page?: number; limit?: number }>,
): Generator {
  try {
    const response = yield call(
      api.post,
      WORK_LOCATION_LIST_API,
      action.payload,
    );

    yield put(fetchWorkLocationsSuccess(response.data));
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err?.response?.data?.message || "Failed to fetch work locations";

    yield put(fetchWorkLocationsFailure(message));
  }
}

export default function* workLocationSaga() {
  yield takeLatest(fetchWorkLocationsRequest.type, fetchWorkLocations);
}
