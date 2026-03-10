export const ROUTES = {
  // Auth
  SIGNIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_OTP: '/verify-otp',
  RESET_PASSWORD: '/reset-password',
  INITIAL_ORGANISATION: '/setup/initial-organisation',

  // Main
  DASHBOARD: '/',
  EMPLOYEES: '/employees',
  ADD_EMPLOYEE: '/employees/new',
  EDIT_EMPLOYEE: '/employees/edit/:id',
  EMPLOYEE_WIZARD: '/employees/wizard/:id',

  // Settings
  SETTINGS: '/settings',
  DEPARTMENTS: '/settings/departments',
  DESIGNATIONS: '/settings/designations',
  SALARY_COMPONENTS: '/settings/salary-components',
  WORK_LOCATIONS: '/settings/work-locations',

  // Setup (Protected)
  SETUP_ORGANISATION: '/setup/organisation',
  SETUP_TAX: '/setup/tax',
  SETUP_PAY_SCHEDULE: '/setup/pay-schedule',
  SETUP_STATUTORY: '/setup/statutory',
  SETUP_PRIOR_PAYROLL: '/setup/prior-payroll',

  // Payroll
  PAY_RUNS: '/pay-runs',
  RUN_PAYROLL: '/pay-runs/new',
  PAY_RUN_DETAILS: '/pay-runs/:id',
  ADD_ONE_TIME_PAYOUT: '/pay-runs/one-time-payout',

  // Approvals
  APPROVALS: '/approvals',
  NEW_APPROVAL: '/approvals/new',

  // Other Main Routes
  INVOICE: '/invoice-generator',
  LOANS: '/loans',
  GIVING: '/giving',
  DOCUMENTS: '/documents',
  REPORTS: '/reports',
};
