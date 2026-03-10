import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";

import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import AddEmployee from "./pages/AddEmployee";
import EmployeeProfile from "./pages/EmployeeProfile";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Designations from "./pages/Designations";
import SalaryComponents from "./pages/SalaryComponents";
import OrganisationProfile from "./pages/setup/OrganisationProfile";
import TaxDetails from "./pages/setup/TaxDetails";
import PaySchedule from "./pages/setup/PaySchedule";
import StatutoryComponents from "./pages/setup/StatutoryComponents";
import PriorPayroll from "./pages/setup/PriorPayroll";

import PayRuns from "./pages/PayRuns";
import RunPayroll from "./pages/RunPayroll";
import PayRunDetails from "./pages/PayRunDetails";
import SubmitRequest from "./pages/SubmitRequest";
import { ROUTES } from "./constant/routes";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import OtpVerification from "./pages/auth/OtpVerification";
import ResetPassword from "./pages/auth/ResetPassword";
import InitialOrganisationProfile from "./pages/setup/InitialOrganisationProfile";
import Approvals from "./pages/Approvals";
import PublicRoute from "./components/routes/PublicRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import WorkLocation from "./pages/WorkLocation";
import AddOneTimePayout from "./pages/AddOneTimePayout";

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <Routes>
        <Route element={<PublicRoute />}>
          <Route
            element={
              <AuthLayout>
                <Outlet />
              </AuthLayout>
            }
          >
            <Route path={ROUTES.SIGNIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={ROUTES.VERIFY_OTP} element={<OtpVerification />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
            <Route
              path={ROUTES.INITIAL_ORGANISATION}
              element={<InitialOrganisationProfile />}
            />
          </Route>
        </Route>

        <Route element={<PrivateRoute />}>
          <Route
            element={
              <MainLayout>
                <Outlet />
              </MainLayout>
            }
          >
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.EMPLOYEES} element={<Employees />} />
            <Route path={ROUTES.ADD_EMPLOYEE} element={<AddEmployee />} />
            <Route path={ROUTES.EDIT_EMPLOYEE} element={<EmployeeProfile />} />
            <Route path={ROUTES.EMPLOYEE_WIZARD} element={<AddEmployee />} />

            <Route path={ROUTES.SETTINGS} element={<Settings />} />
            <Route path={ROUTES.DEPARTMENTS} element={<Departments />} />
            <Route path={ROUTES.DESIGNATIONS} element={<Designations />} />
            <Route path={ROUTES.WORK_LOCATIONS} element={<WorkLocation />} />

            <Route
              path={ROUTES.SALARY_COMPONENTS}
              element={<SalaryComponents />}
            />
            <Route
              path={ROUTES.SETUP_ORGANISATION}
              element={<OrganisationProfile />}
            />
            <Route path={ROUTES.SETUP_TAX} element={<TaxDetails />} />
            <Route path={ROUTES.SETUP_PAY_SCHEDULE} element={<PaySchedule />} />
            <Route
              path={ROUTES.SETUP_STATUTORY}
              element={<StatutoryComponents />}
            />
            <Route
              path={ROUTES.SETUP_PRIOR_PAYROLL}
              element={<PriorPayroll />}
            />
            <Route path={ROUTES.PAY_RUNS} element={<PayRuns />} />
            <Route path={ROUTES.RUN_PAYROLL} element={<RunPayroll />} />
            <Route path={ROUTES.ADD_ONE_TIME_PAYOUT} element={<AddOneTimePayout />} />
            <Route path={ROUTES.PAY_RUN_DETAILS} element={<PayRunDetails />} />
            <Route path={ROUTES.APPROVALS} element={<Approvals />} />
            <Route path={ROUTES.NEW_APPROVAL} element={<SubmitRequest />} />

            <Route
              path="*"
              element={<div className="text-slate-500 p-8">Page Not Found</div>}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
