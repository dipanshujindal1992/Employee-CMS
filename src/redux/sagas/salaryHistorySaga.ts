import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { SALARY_HISTORY_API } from "../../constant/api";
import {
    salaryHistoryListFailure,
    salaryHistoryListRequest,
    salaryHistoryListSuccess,
} from "../services/salaryHistorySlice";

export function* handleSalaryHistoryList(
    action: PayloadAction<{ employeeId: string; page?: number; limit?: number }>
): Generator {
    try {
        const { employeeId, page, limit } = action.payload;
        const response = yield call(api.get, SALARY_HISTORY_API(employeeId), {
            params: { page, limit },
        });

        yield put(salaryHistoryListSuccess(response?.data?.data));
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        const message = err.response?.data?.message || "Failed to fetch salary history";
        yield put(salaryHistoryListFailure(message));
    }
}

export default function* salaryHistorySaga() {
    yield takeLatest(salaryHistoryListRequest.type, handleSalaryHistoryList);
}
