import { call, put, takeLatest } from "redux-saga/effects";
import { AxiosError } from "axios";
import api from "../../api/api";
import {
  dashboardDataRequest,
  dashboardDataSuccess,
  dashboardDataFailure,
} from "../services/dashboardSlice";
import { DASHBOARD_DATA_API } from "../../constant/api";
import type { ComponentDetails_Type } from "../services/dashboardSlice";

interface DashboardResponse {
  success: boolean;
  data: {
    componentDetails: ComponentDetails_Type;
    totalEmployee: number;
    activeEmployee: number;
    inActiveEmployee: number;
    pendingEmployee: number;
  };
  message: string;
}

function* handleDashboardData() {
  try {
    const response: { data: DashboardResponse } = yield call(
      api.get,
      DASHBOARD_DATA_API,
      {},
    );

    yield put(dashboardDataSuccess(response.data));
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    yield put(
      dashboardDataFailure(
        axiosError.response?.data?.message ||
          "Something went wrong while fetching dashboard data",
      ),
    );
  }
}

export function* watchDashboardSaga() {
  yield takeLatest(dashboardDataRequest.type, handleDashboardData);
}
