import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  Monitor,
  Phone,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ROUTES } from "../constant/routes";
import Card from "../components/common/Card";
import GettingStarted from "../components/dashboard/GettingStarted";
import type { RootState } from "../redux/store";
import { employeeListRequest } from "../redux/services/employeeSlice";
import { dashboardDataRequest } from "../redux/services/dashboardSlice";
import CustomButton from "../components/common/CustomButton";
import CustomSelectbox from "../components/common/CustomSelectbox";



interface BenefitItemProps {
  title: string;
  icon: React.ElementType;
  color: string;
}

const BenefitItem = React.memo(
  ({ title, icon: Icon, color }: BenefitItemProps) => (
    <div className="flex flex-col items-center p-4 border border-slate-50 rounded-lg hover:bg-slate-50/50 transition-colors group">
      <div
        className={`w-10 h-10 rounded-lg bg-${color}-50 flex items-center justify-center text-${color}-600 mb-3 group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
        {title}
      </span>
      <span className="text-lg font-bold text-slate-400">0</span>
      <CustomButton className="mt-4 text-[11px] font-bold text-[#4285F4] uppercase tracking-wider hover:underline">
        View Details
      </CustomButton>
    </div>
  ),
);

const PAYROLL_COST_OPTIONS = [
  { label: "This Year", value: "this_year" },
  { label: "Previous Year", value: "previous_year" },
  { label: "This Quarter", value: "this_quarter" },
  { label: "Previous Quarter", value: "previous_quarter" },
];

const PayrollCostChart = React.memo(() => (
  <Card
    title="Payroll Cost Summary"
    extra={
      <CustomSelectbox
        options={PAYROLL_COST_OPTIONS}
        className="text-xs bg-transparent border-none font-semibold text-slate-500 cursor-pointer outline-none py-0! pr-6!"
        defaultValue="this_year"
        placeholder="Select Period"
      />
    }
  >
    <div className="relative h-64 w-full mt-4 flex items-end justify-between px-4 pb-8 ">
      {/* Chart Grid Lines */}
      {[0, 200, 400, 600, 800].map((v) => (
        <div
          key={v}
          className="absolute left-0 right-0 border-t border-slate-50 ml-10"
          style={{ bottom: `${(v / 800) * 100}%` }}
        >
          <span className="absolute -left-8 -top-2 text-[10px] text-slate-400 font-medium">
            {v}
          </span>
        </div>
      ))}

      {/* Actual Bars (Placeholder) */}
      <div className="flex flex-1 items-end justify-around h-full pt-4">
        {[
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
          "Jan",
          "Feb",
          "Mar",
        ].map((month, i) => (
          <div
            key={month}
            className="flex flex-col items-center gap-2 group relative"
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: i === 0 ? "80%" : "2px" }}
              transition={{ delay: i * 0.05, duration: 1 }}
              className={`w-3 rounded-t-sm ${i === 0 ? "bg-[#00A99D]" : "bg-slate-100"}`}
            ></motion.div>
            <span className="text-[10px] text-slate-400 font-medium absolute -bottom-6 rotate-0">
              {month}
              <br />
              <span className="text-[8px] opacity-70">2025</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  </Card>
));

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employeeList, totalCount } = useSelector(
    (state: RootState) => state.employee,
  );
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    errorMessage: dashboardError,
  } = useSelector((state: RootState) => state.dashboard);

  // Derive the completion state from the backend data
  const isSetupComplete = useMemo(() => {
    if (!dashboardData?.completionDetails) return false;

    // Check if all the required steps are complete
    const {
      isOrganizationComplete = false,
      isTaxComplete = false,
      isPayScheduleComplete = false,
      isSalaryComplete = false,
      isEmployeeComplete = false,
      isPayrollComplete = false,
    } = dashboardData.completionDetails;

    return (
      isOrganizationComplete &&
      isTaxComplete &&
      isPayScheduleComplete &&
      isSalaryComplete &&
      isEmployeeComplete &&
      isPayrollComplete
    );
  }, [dashboardData]);

  // Initial data load when component mounts
  useEffect(() => {
    dispatch(dashboardDataRequest());
  }, [dispatch]);

  useEffect(() => {
    if (isSetupComplete) {
      dispatch(employeeListRequest({ page: 1, limit: 10 }));
    }
  }, [dispatch, isSetupComplete]);


  if (isDashboardLoading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#00A99D] border-t-transparent animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isSetupComplete) {
    return (
      <GettingStarted onComplete={() => dispatch(dashboardDataRequest())} />
    );
  }

  const MONTH_OPTIONS = [
    { label: "Previous Month", value: "previous_month" },
    { label: "This Month", value: "this_month" },
  ];
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <h1 className="text-lg font-semibold text-slate-700">
          Welcome trydigital solution!
        </h1>
        <div className="flex items-center gap-6">
          <CustomButton className="flex items-center gap-2 text-xs font-bold text-[#4285F4] hover:underline cursor-pointer">
            <Monitor className="w-3.5 h-3.5" />
            Recent Updates
            <ChevronRight className="w-3 h-3" />
          </CustomButton>
          <div className="flex items-center gap-3 border-l border-slate-100 pl-6 text-[11px] text-slate-500">
            <Phone className="w-3.5 h-3.5" />
            <div>
              <p className="font-bold">Help Line : 18005726671</p>
              <p className="text-[10px]">9AM - 7PM Toll Free</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center ml-2">
              <span className="text-xs font-bold text-white uppercase">T</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content (3/4) */}
        <div className="lg:col-span-3 space-y-6">
        

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              title="Benefits and Deductions"
              extra={
                <CustomSelectbox
                  options={MONTH_OPTIONS}
                  className="text-xs bg-transparent border-none font-semibold text-slate-500 cursor-pointer outline-none py-0! pr-6!"
                  defaultValue="previous_month"
                />
              }
            >
              <div className="grid grid-cols-3 gap-2 py-4">
                <BenefitItem title="EPF" icon={Activity} color="indigo" />
                <BenefitItem title="ESI" icon={CheckCircle2} color="emerald" />
                <BenefitItem title="TDS" icon={Activity} color="orange" />
              </div>
            </Card>

            <Card title="Employee Summary">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative group">
                  Active Employees
                  <div className="cursor-help">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-10 w-max max-w-[200px] text-center">
                    Number of active employees
                  </div>
                </div>
                <h2 className="text-5xl font-bold text-[#00A99D] mb-4">
                  {isDashboardLoading ? (
                    <span className="text-2xl animate-pulse text-slate-300">
                      Loading...
                    </span>
                  ) : dashboardData ? (
                    dashboardData.activeEmployee
                  ) : (
                    totalCount || employeeList.length || "0"
                  )}
                </h2>
                {dashboardError && (
                  <p className="text-[10px] text-red-400 mb-2">
                    {dashboardError}
                  </p>
                )}
                <CustomButton
                  variant="none"
                  onClick={() => navigate(ROUTES.EMPLOYEES)}
                  className="text-xs font-bold text-[#4285F4] hover:underline p-0!"
                >
                  View Employees
                </CustomButton>
              </div>
            </Card>
          </div>

          <PayrollCostChart />
        </div>

        {/* Sidebar (1/4) */}
        <div className="lg:col-span-1">
          <Card title="To Do Tasks" className="h-full min-h-[500px]">
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
              <div className="relative">
                <div className="w-32 h-32 bg-purple-50 rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    {/* SVG Illustration Placeholder */}
                    <svg
                      viewBox="0 0 24 24"
                      className="w-16 h-16 text-purple-400 opacity-60"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" />
                    </svg>
                  </motion.div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800">Time to celebrate!</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  You have no pending tasks.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
