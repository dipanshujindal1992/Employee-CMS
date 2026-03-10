import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import {
  payrunAddFailure, payrunAddRequest, payrunAddSuccess, payrunListFailure, payrunListRequest, payrunListSuccess, payrunEmployeeAddRequest,
  payrunEmployeeAddSuccess,
  payrunEmployeeAddFailure, payrunEmployeeListRequest,
  payrunEmployeeListSuccess,
  payrunEmployeeListFailure,
  payrunRemoveEmployeeSuccess,
  payrunDetailsListFailure,
  payrunDetailsListSuccess,
  payrunRemoveEmployeeFailure,
  payrunRemoveEmployeeRequest,
  payrunDetailsListRequest,
  createPayrunFailure,
  createPayrunSuccess,
  createPayrunRequest,

} from "../services/payrunSlice";
import { PAYRUN_ADD_API, PAYRUN_LIST_API, PAYRUN_EMPLOYEE_LIST_API, CREATE_PAYRUN_API } from "../../constant/api";



import { PAYRUN_DELETE_API } from "../../constant/api";
import {
  payrunDeleteRequest,
  payrunDeleteSuccess,
  payrunDeleteFailure,
} from "../services/payrunSlice";

import { PAYRUN_EMPLOYEE_ADD_API } from "../../constant/api";
import {
  PAYRUN_DETAILS_LIST_API,
  PAYRUN_REMOVE_EMPLOYEE_API,
} from "../../constant/api";
/* ===========================
   API CONSTANTS
=========================== */

/* ===========================
   GET PAYRUN LIST
=========================== */

export function* handlePayrunList(action: PayloadAction<unknown>): Generator {
  try {
    const response = yield call(
      api.post,
      PAYRUN_LIST_API,
      action.payload
    );

    yield put(payrunListSuccess(response.data.data));
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err.response?.data?.message ||
      "Payrun fetch failed";

    yield put(payrunListFailure(message));
  }
}

/* ===========================
   ADD PAYRUN
=========================== */

export function* handlePayrunAdd(
  action: PayloadAction<unknown>,
): Generator {
  try {
    const response = yield call(
      api.post,
      PAYRUN_ADD_API,
      action.payload,
    );

    yield put(payrunAddSuccess(response.data));
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err.response?.data?.message ||
      "Payrun add failed";

    yield put(payrunAddFailure(message));
  }
}
export function* handlePayrunEmployeeAdd(
  action: PayloadAction<{ payRunId: string; type: string; employeeId: string; netPay?: number }>
): Generator {
  try {
    const { payRunId, type, employeeId, netPay } = action.payload;
    const response = yield call(
      api.post,
      PAYRUN_EMPLOYEE_ADD_API,
      { payRunId, type, employeeId, netPay }
    );

    yield put(payrunEmployeeAddSuccess({
      message: response.data.message || 'Added Employee',
      data: response.data?.data
    }));

  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err.response?.data?.message ||
      "Payrun employee add failed";

    yield put(payrunEmployeeAddFailure(message));
  }
}
export function* handlePayrunEmployeeList(
  action: PayloadAction<unknown>
): Generator {
  try {
    const response = yield call(
      api.post,
      PAYRUN_EMPLOYEE_LIST_API,
      action.payload
    );

    yield put(payrunEmployeeListSuccess(response.data));
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err.response?.data?.message ||
      "Payrun employee list fetch failed";

    yield put(payrunEmployeeListFailure(message));
  }
}
export function* handlePayrunDelete(
  action: PayloadAction<string | { id: string }>
): Generator {
  try {
    const payload = action.payload;
    const deleteId = typeof payload === 'object' && payload !== null && 'id' in payload ? payload.id : payload;
    const response = yield call(
      api.delete,
      PAYRUN_DELETE_API(deleteId)
    );

    yield put(payrunDeleteSuccess(response.data));

  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err.response?.data?.message ||
      "Payrun delete failed";

    yield put(payrunDeleteFailure(message));
  }
}
export function* handlePayrunDetailsList(
  action: PayloadAction<unknown>
): Generator {
  try {
    const response = yield call(
      api.post,
      PAYRUN_DETAILS_LIST_API,
      action.payload
    );

    yield put(payrunDetailsListSuccess(response.data.data));
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err.response?.data?.message ||
      "Payrun details fetch failed";

    yield put(payrunDetailsListFailure(message));
  }
}
export function* handlePayrunRemoveEmployee(
  action: PayloadAction<string>
): Generator {
  try {
    const response = yield call(
      api.delete,
      PAYRUN_REMOVE_EMPLOYEE_API(action.payload)
    );

    yield put(payrunRemoveEmployeeSuccess(response.data));
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err.response?.data?.message ||
      "Payrun employee remove failed";

    yield put(payrunRemoveEmployeeFailure(message));
  }
}
export function* handleCreatePayrun(
  action: PayloadAction<unknown>,
): Generator {
  try {
    const response = yield call(
      api.post,
      CREATE_PAYRUN_API,
      action.payload,
    );
    yield put(createPayrunSuccess({
      message: response.data.message || 'Payrun created successfully',
      data: response.data?.data
    }));
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const message =
      err.response?.data?.message ||
      "Payrun creation failed";

    yield put(createPayrunFailure(message));
  }
}
/* ===========================
   WATCHER
=========================== */

export default function* payrunSaga() {
  yield takeLatest(payrunListRequest.type, handlePayrunList);
  yield takeLatest(payrunAddRequest.type, handlePayrunAdd);
  yield takeLatest(
    payrunEmployeeAddRequest.type,
    handlePayrunEmployeeAdd
  );
  yield takeLatest(
    payrunEmployeeListRequest.type,
    handlePayrunEmployeeList
  );
  yield takeLatest(payrunDeleteRequest.type, handlePayrunDelete);
  yield takeLatest(
    payrunDetailsListRequest.type,
    handlePayrunDetailsList
  );

  yield takeLatest(
    payrunRemoveEmployeeRequest.type,
    handlePayrunRemoveEmployee
  );
  yield takeLatest(
    createPayrunRequest.type,
    handleCreatePayrun
  );
}