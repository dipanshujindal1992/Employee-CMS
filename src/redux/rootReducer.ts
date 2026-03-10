import { combineReducers } from "@reduxjs/toolkit";

import auth from "./services/authSlice";
import designation from "./services/designationSlice";
import salaryComponent from "./services/salaryComponentSlice";
import workLocation from "./services/workLocationSlice";
import department from "./services/departmentSlice";
import earning from "./services/earningSlice"
import employee from "./services/employeeSlice"
import organization from "./services/organizationSlice"
import tax from "./services/taxSlice"
import payrun from "./services/payrunSlice"
import dashboard from "./services/dashboardSlice";
import paySchedule from "./services/payScheduleSlice";
import salaryHistory from "./services/salaryHistorySlice";
import deduction from "./services/deductionSlice";


import storage from "redux-persist/lib/storage";

const appReducer = combineReducers({
  auth,
  designation,
  salaryComponent,
  workLocation,
  department,
  earning,
  employee,
  organization,
  tax,
  payrun,
  dashboard,
  paySchedule,
  salaryHistory,
  deduction
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/logoutSuccess') {
    storage.removeItem('persist:root');
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
