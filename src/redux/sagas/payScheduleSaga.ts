import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { PAY_SCHEDULE_GET_API, PAY_SCHEDULE_SET_API } from "../../constant/api";
import {
    payScheduleGetFailure,
    payScheduleGetRequest,
    payScheduleGetSuccess,
    payScheduleSetFailure,
    payScheduleSetRequest,
    payScheduleSetSuccess,
} from "../services/payScheduleSlice";

export function* handlePayScheduleGet(): Generator {
    try {
        const response = yield call(api.get, PAY_SCHEDULE_GET_API);
        yield put(payScheduleGetSuccess(response?.data?.data));
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        const message =
            err.response?.data?.message || "Failed to get Pay Schedule details";
        yield put(payScheduleGetFailure(message));
    }
}

export function* handlePayScheduleSet(action: PayloadAction<unknown>): Generator {
    try {
        const response = yield call(api.post, PAY_SCHEDULE_SET_API, action.payload);
        yield put(
            payScheduleSetSuccess({
                message: response?.data?.message || "Pay Schedule updated successfully",
                data: action.payload,
            })
        );
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        const message =
            err.response?.data?.message || "Failed to set Pay Schedule details";
        yield put(payScheduleSetFailure(message));
    }
}

export default function* payScheduleSaga() {
    yield takeLatest(payScheduleGetRequest.type, handlePayScheduleGet);
    yield takeLatest(payScheduleSetRequest.type, handlePayScheduleSet);
}
