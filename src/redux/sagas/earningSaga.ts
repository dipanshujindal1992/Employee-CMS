import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import api from "../../api/api";

import {
  addEarningRequest,
  addEarningSuccess,
  addEarningFailure,
  updateEarningRequest,
  updateEarningSuccess,
  updateEarningFailure,
  deleteEarningRequest,
  deleteEarningSuccess,
  deleteEarningFailure,
  fetchEarningByIdRequest,
  fetchEarningByIdSuccess,
  fetchEarningByIdFailure,
  updateEarningStatusRequest,
  updateEarningStatusSuccess,
  updateEarningStatusFailure,
  fetchEarningsRequest,
  fetchEarningsSuccess,
  fetchEarningsFailure,
  type Earning,
  type FetchEarningsPayload,
  type FetchEarningsResponse,
  type EarningResponse,
  fetchSalaryEarningListRequest,
  fetchSalaryEarningListFailure,
  fetchSalaryEarningListSuccess,
} from "../services/earningSlice";

import {
  EARNING_ADD_API,
  EARNING_GET_API,
  EARNING_UPDATE_API,
  EARNING_DELETE_API,
  EARNING_STATUS_API,
  EARNING_LIST_API,
  USER_SALARY_EARNING_LIST_API,
} from "../../constant/api";

function* addEarning(action: PayloadAction<Partial<Earning>>): Generator {
  try {
    const response = (yield call(
      api.post,
      EARNING_ADD_API,
      action.payload
    )) as { data: EarningResponse };
    yield put(addEarningSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "Failed to add earning";
    yield put(addEarningFailure(message));
  }
}

function* fetchEarningById(action: PayloadAction<string>): Generator {
  try {
    const url = EARNING_GET_API(action.payload);
    const response = (yield call(api.get, url)) as {
      data: { data: Earning };
    };
    yield put(fetchEarningByIdSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "Failed to fetch earning";
    yield put(fetchEarningByIdFailure(message));
  }
}

function* updateEarning(
  action: PayloadAction<{ id: string; data: Partial<Earning> }>
): Generator {
  try {
    const { id, data } = action.payload;
    const url = EARNING_UPDATE_API(id);
    const response = (yield call(api.put, url, data)) as {
      data: EarningResponse;
    };
    yield put(updateEarningSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "Failed to update earning";
    yield put(updateEarningFailure(message));
  }
}

function* updateEarningStatus(
  action: PayloadAction<{ id: string; data: Partial<Earning> }>
): Generator {
  try {
    const { id, data } = action.payload;
    const url = EARNING_STATUS_API(id);
    const response = (yield call(api.patch, url, data)) as {
      data: EarningResponse;
    };
    yield put(updateEarningStatusSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "Failed to update earning status";
    yield put(updateEarningStatusFailure(message));
  }
}

function* deleteEarning(action: PayloadAction<string>): Generator {
  try {
    const url = EARNING_DELETE_API(action.payload);
    const response = (yield call(api.delete, url)) as {
      data: { message: string; data: { _id: string } };
    };
    yield put(deleteEarningSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "Failed to delete earning";
    yield put(deleteEarningFailure(message));
  }
}

function* fetchEarnings(
  action: PayloadAction<FetchEarningsPayload>
): Generator {
  try {
    const response = (yield call(
      api.post,
      EARNING_LIST_API,
      action.payload
    )) as { data: FetchEarningsResponse };

    yield put(fetchEarningsSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message || "Failed to fetch earnings";

    yield put(fetchEarningsFailure(message));
  }
}
function* fetchSalaryEarningList(): Generator {
  try {
    const response = (yield call(
      api.post,
      USER_SALARY_EARNING_LIST_API
    )) as { data: { message: string; data: Earning[] } };

    yield put(fetchSalaryEarningListSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message ||
      "Failed to fetch salary earning list";

    yield put(fetchSalaryEarningListFailure(message));
  }
}

export default function* earningSaga() {
  yield takeLatest(fetchEarningsRequest.type, fetchEarnings);
  yield takeLatest(addEarningRequest.type, addEarning);
  yield takeLatest(fetchEarningByIdRequest.type, fetchEarningById);
  yield takeLatest(updateEarningRequest.type, updateEarning);
  yield takeLatest(updateEarningStatusRequest.type, updateEarningStatus);
  yield takeLatest(deleteEarningRequest.type, deleteEarning);
  yield takeLatest(
  fetchSalaryEarningListRequest.type,
  fetchSalaryEarningList
);
}
