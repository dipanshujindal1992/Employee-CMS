import { call, put, takeLatest } from "redux-saga/effects";
import type { AxiosError } from "axios";
import api from "../../api/api";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchSalaryCategoryFailure,
  fetchSalaryCategoryRequest,
  fetchSalaryCategorySuccess,
  fetchEarningTypeRequest,
  fetchEarningTypeSuccess,
  fetchEarningTypeFailure,
  type FetchSalaryCategoryPayload,
  type SalaryCategory,
  type EarningType,
} from "../services/salaryComponentSlice";
import {
  EARNING_TYPE_LIST_API,
  SALARY_CATEGORY_LIST_API,
} from "../../constant/api";

function* fetchSalaryCategories(
  action: PayloadAction<FetchSalaryCategoryPayload>,
): Generator {
  try {
    const response = (yield call(api.get, SALARY_CATEGORY_LIST_API, {
      params: action.payload,
    })) as { data: { data: SalaryCategory[] } };

    yield put(fetchSalaryCategorySuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;

    const message =
      axiosError.response?.data?.message ?? "Failed to fetch salary categories";

    yield put(fetchSalaryCategoryFailure(message));
  }
}

function* fetchEarningTypes(): Generator {
  try {
    const response = (yield call(api.get, EARNING_TYPE_LIST_API)) as {
      data: { data: EarningType[] };
    };

    yield put(fetchEarningTypeSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;

    const message =
      axiosError.response?.data?.message ?? "Failed to fetch earning types";

    yield put(fetchEarningTypeFailure(message));
  }
}

export default function* salaryComponentSaga() {
  yield takeLatest(fetchSalaryCategoryRequest.type, fetchSalaryCategories);
  yield takeLatest(fetchEarningTypeRequest.type, fetchEarningTypes);
}
