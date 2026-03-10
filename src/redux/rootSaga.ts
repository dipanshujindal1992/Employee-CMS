import { all } from "redux-saga/effects";
import authSaga from "../redux/sagas/authSaga";
import designationSaga from "./sagas/designationSaga";
import workLocationSaga from "./sagas/workLocationSaga";
import departmentSaga from "./sagas/departmentSaga";
import salaryComponentSaga from "./sagas/salaryComponentSaga";
import earningSaga from "./sagas/earningSaga";
import { watchEmployeeSaga } from "./sagas/employeeSaga";
import organizationSaga from "./sagas/organizationSaga";
import { watchDashboardSaga } from "./sagas/dashboardSaga";
import taxSaga from "./sagas/taxSaga";
import payrunSaga from "./sagas/payrunSaga";
import payScheduleSaga from "./sagas/payScheduleSaga";
import salaryHistorySaga from "./sagas/salaryHistorySaga";
import { watchDeductionSaga } from "./sagas/deductionSaga";

export function* rootSaga() {
  yield all([
    authSaga(),
    designationSaga(),
    workLocationSaga(),
    departmentSaga(),
    salaryComponentSaga(),
    earningSaga(),
    watchEmployeeSaga(),
    organizationSaga(),
    watchDashboardSaga(),
    taxSaga(),
    payrunSaga(),
    payScheduleSaga(),
    salaryHistorySaga(),
    watchDeductionSaga()
  ]);
}
