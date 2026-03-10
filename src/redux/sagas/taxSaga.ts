import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AxiosError, type AxiosResponse } from "axios";
import api from "../../api/api";
import {
  taxGetFailure,
  taxGetRequest,
  taxGetSuccess,
  taxSetFailure,
  taxSetRequest,
  taxSetSuccess,
  type TaxData
} from "../services/taxSlice";
import { TAX_GET_API, TAX_SET_API } from "../../constant/api";


export function* handleTaxGet(): Generator {
  try {
    const response = (yield call(api.get, TAX_GET_API)) as AxiosResponse<{
      message: string;
      success?: boolean;
      data?: any;
    }>;

    yield put(taxGetSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message = axiosError.response?.data?.message || "Failed to fetch tax details";
    yield put(taxGetFailure(message));
  }
}

/* ===========================
   SET TAX
=========================== */

export function* handleTaxSet(action: PayloadAction<Omit<TaxData, 'id' | 'createdAt' | 'updatedAt'>>): Generator {
  try {
    const response = (yield call(api.post, TAX_SET_API, action.payload)) as AxiosResponse<{
      message: string;
      success?: boolean;
    }>;

    yield put(taxSetSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message = axiosError.response?.data?.message || "Failed to set tax details";
    yield put(taxSetFailure(message));
  }
}

/* ===========================
   WATCHER
=========================== */

export default function* taxSaga() {
  yield takeLatest(taxGetRequest.type, handleTaxGet);
  yield takeLatest(taxSetRequest.type, handleTaxSet);
}