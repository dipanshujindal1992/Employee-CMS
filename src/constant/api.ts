export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const IMAGE_BASE_URL = BASE_URL.replace(/\/api$/, "");

export const LOGIN_API = `/user/login`;
export const SIGNUP_API = `/user/register`;
export const FORGOT_PASSWORD_API = `/user/send-otp`;
export const OTP_VERIFY_API = `/user/verify-otp`;
export const RESET_PASSWORD_API = `/user/reset-password`;
export const USER_PROFILE_API = `/user/profile`;
export const ORGANIZATION_ADD_API = `/user/organization-add`;
export const DELETE_ACCOUNT_API = `/user/delete-account`;
export const LOGOUT_API = `/user/logout`;
export const CHANGE_PASSWORD_API = `/user/change-password`;
export const DEPARTMENT_LIST_API = `/user/department-list`;
export const DEPARTMENT_ADD_API = `/user/department-add`;
export const DEPARTMENT_UPDATE_API = (id: string) =>
  `/user/department-update/${id}`;
export const DEPARTMENT_DELETE_API = (id: string) =>
  `/user/department-delete/${id}`;
export const DEPARTMENT_GET_API = (id: string) => `/user/department-get/${id}`;
export const DESIGNATION_LIST_API = `/user/designation-list`;
export const DESIGNATION_ADD_API = `/user/designation-add`;
export const DESIGNATION_UPDATE_API = (id: string) =>
  `/user/designation-update/${id}`;
export const DESIGNATION_DELETE_API = (id: string) =>
  `/user/designation-delete/${id}`;
export const DESIGNATION_GET_API = (id: string) =>
  `/user/designation-get/${id}`;
export const SALARY_CATEGORY_LIST_API = `/user/salary-category`;
export const EARNING_TYPE_LIST_API = `/user/earning-type`;
export const WORK_LOCATION_LIST_API = "/user/worklocation-list";
export const REFRESH_TOKEN_API = "/user/refresh-token";
export const EARNING_ADD_API = `/user/earning-add`;
export const EARNING_GET_API = (id: string) => `/user/earning/${id}`;
export const EARNING_UPDATE_API = (id: string) => `/user/earning/${id}`;
export const EARNING_STATUS_API = (id: string) => `/user/earning-status/${id}`;
export const EARNING_DELETE_API = (id: string) => `/user/earning-delete/${id}`;
export const EARNING_LIST_API = `/user/earning-list`;
export const EMPLOYEE_ADD_API = `/user/employee-add`;
export const EMPLOYEE_LIST_API = "/user/employee-list";
export const EMPLOYEE_DELETE_API = (id: string) =>
  `/user/employee-delete/${id}`;
export const EMPLOYEE_DETAILS_API = (id: string) =>
  `/user/employee-detail/${id}`;
export const USER_SALARY_EARNING_LIST_API = "/user/salary-earning-list";
export const ORGANIZATION_GET_API = "/user/organization-detail";
export const ORGANIZATION_DETAIL_ADD_API = "/user/organization-detail-add";
export const DASHBOARD_DATA_API = "/user/dashboard";
export const TAX_GET_API = "/user/get-tax";
export const TAX_SET_API = "/user/set-tax";
export const PAYRUN_LIST_API = "/user/payrun-listing";
export const PAYRUN_ADD_API = "/user/payrun-add";
export const PAYRUN_EMPLOYEE_ADD_API = "/user/payrun-employee-add";
export const PAYRUN_EMPLOYEE_LIST_API = "/user/payrun-employee-list";
export const PAYRUN_DELETE_API = (id: string) =>
  `/user/payrun-delete/${id}`;
export const PAYRUN_DETAILS_LIST_API = "/user/payrun-details-list";
export const PAYRUN_REMOVE_EMPLOYEE_API = (id: string) =>
  `/user/payrun-remove-employee/${id}`;
export const PAY_SCHEDULE_GET_API = "/user/get-pay-schedule";
export const PAY_SCHEDULE_SET_API = "/user/set-pay-schedule";
export const SALARY_HISTORY_API = (employeeId: string) => `/user/salary-history/${employeeId}`;
export const SALARY_HISTORY_MONTH_DOWNLOAD_API = (id: string) =>
  `/user/salary-history-download/${id}`;
export const CREATE_PAYRUN_API = "/user/payrun-execute";
export const DEDUCTION_ADD_API = "/user/deduction-add";
export const DEDUCTION_GET_API = (id: string) => `/user/deduction-detail/${id}`;
export const DEDUCTION_UPDATE_API = (id: string) =>
  `/user/deduction-update/${id}`;
export const DEDUCTION_STATUS_API = (id: string) => `/user/deduction-status/${id}`;
export const DEDUCTION_DELETE_API = (id: string) => `/user/deduction-delete/${id}`;
export const DEDUCTION_LIST_API = `/user/deduction-list`;
export const DEDUCTION_LIST_RECURRING_API = `/user/deduction-list/recurring`;
export const DEDUCTION_DELETE_EMPLOYEE_API = (id: string) => `/user/deduction-delete-employee/${id}`;
export const DEDUCTION_ADD_EMPLOYEE_API = `/user/deduction-add-employee`;
export const DEDUCTION_UPDATE_EMPLOYEE_API = (id: string) => `/user/deduction-update-employee/${id}`;
