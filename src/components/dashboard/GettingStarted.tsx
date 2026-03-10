import React, { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import { ROUTES } from "../../constant/routes";
import { Check, Phone, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import CustomButton from "../common/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { dashboardDataRequest } from "../../redux/services/dashboardSlice";
// import Dashboard from "../../pages/Dashboard";

interface SubStep {
  title: string;
  isCompleted: boolean;
  note?: string;
}

interface Step {
  id: number;
  title: string;
  isCompleted: boolean;
  route: string;
  subSteps?: SubStep[];
}

const steps: Step[] = [
  {
    id: 1,
    title: "Add Organisation Details",
    isCompleted: false,
    route: ROUTES.SETUP_ORGANISATION,
  },
  {
    id: 2,
    title: "Provide your Tax Details",
    isCompleted: false,
    route: ROUTES.SETUP_TAX,
  },
  {
    id: 3,
    title: "Configure your Pay Schedule",
    isCompleted: false,
    route: ROUTES.SETUP_PAY_SCHEDULE,
  },
 
  {
    id: 4,
    title: "Set up Salary Components",
    isCompleted: false,
    route: ROUTES.SALARY_COMPONENTS,
  },
  {
    id: 5,
    title: "Add Employees",
    isCompleted: false,
    route: ROUTES.ADD_EMPLOYEE,
  },
  {
    id: 6,
    title: "Configure Prior Payroll",
    isCompleted: false,
    route: ROUTES.PAY_RUNS,
  },
];
const GettingStarted: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dashboardDataRequest());
  }, []);
  const dashboardData = useSelector((state: RootState) => state.dashboard.data);

  // Load completion status from dashboardData
  const completedSteps = useMemo<Record<number, boolean>>(() => {
    const details = dashboardData?.completionDetails;
    return {
      1: details?.isOrganizationComplete ?? false,
      2: details?.isTaxComplete ?? false,
      3: details?.isPayScheduleComplete ?? false,
      4: details?.isSalaryComplete ?? false,
      5: details?.isEmployeeComplete ?? false,
      6: details?.isPayrollComplete ?? false,
    };
  }, [dashboardData]);

  const stepsWithStatus = useMemo(
    () =>
      steps?.map((step) => ({
        ...step,
        isCompleted: completedSteps[step.id] || false,
      })),
    [completedSteps],
  );

  const completedCount = useMemo(
    () => stepsWithStatus?.filter((s) => s?.isCompleted).length,
    [stepsWithStatus],
  );
  const progress = useMemo(
    () => (completedCount / steps.length) * 100,
    [completedCount],
  );

  React.useEffect(() => {
    if (completedCount === steps.length) {
      onComplete();
    }
  }, [completedCount, onComplete]);

  const handleNavigation = useCallback(
    (route: string) => {
      navigate(route);
    },
    [navigate],
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Help Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <p className="text-slate-500 text-sm">
          Set up your organisation before you run your first payroll.
        </p>
        <div className="flex items-center justify-center text-xs text-slate-400 gap-1">
          <Phone className="w-3 h-3" />
          <span>
            Need help? Call us Mon-Fri, 9 AM-7 PM at{" "}
            <span className="font-bold text-slate-600">
              18005726671 (toll-free)
            </span>
            .
          </span>
        </div>
      </motion.div>

      {/* Main Checklist Card */}
      <Card
        noPadding
        className="overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50"
      >
        {/* Header */}
        <div className="bg-[#4285F4] px-4 sm:px-8 py-6 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                Get started with Trydigital Payroll
              </h2>
              <p className="text-blue-50 mt-1 text-sm opacity-90">
                Complete the following steps to have a hassle-free payroll
                experience
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
              <div className="w-full sm:w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                />
              </div>
              <div className="text-left sm:text-right">
                <span className="text-sm font-medium whitespace-nowrap">
                  {completedCount}/{steps.length} Completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100 bg-white">
          {stepsWithStatus?.map((step, index) => {
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 sm:p-6 transition-colors hover:bg-slate-50/30"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
                    <div
                      className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
                        step?.isCompleted
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-400 border border-slate-200",
                      )}
                    >
                      {step?.isCompleted ? (
                        <Check className="w-5 h-5 stroke-[3px]" />
                      ) : (
                        <Check className="w-5 h-5 opacity-30" />
                      )}
                    </div>
                    <div>
                      <div
                        className="flex items-center gap-1 group cursor-pointer"
                        onClick={() => handleNavigation(step.route)}
                      >
                        <h3
                          className={clsx(
                            "font-medium text-[15px] transition-colors",
                            step?.isCompleted
                              ? "text-slate-800"
                              : "text-slate-600",
                          )}
                        >
                          {step?.id}. {step?.title}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {step?.subSteps && (
                        <div className="mt-4 ml-4 pl-6 border-l border-slate-200 space-y-3">
                          {step?.subSteps?.map((sub, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 text-[13px]"
                            >
                              <div
                                className={clsx(
                                  "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0",
                                  sub?.isCompleted
                                    ? "bg-emerald-500 text-white"
                                    : "bg-white border border-slate-300",
                                )}
                              >
                                <Check
                                  className={clsx(
                                    "w-2.5 h-2.5",
                                    sub?.isCompleted
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </div>
                              <span
                                className={clsx(
                                  sub?.isCompleted
                                    ? "text-slate-700"
                                    : "text-slate-500",
                                )}
                              >
                                {sub?.title}
                                {sub?.note && (
                                  <span className="text-slate-400 ml-1 font-normal">
                                    {sub?.note}
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="self-end sm:self-center ml-11 sm:ml-0 w-full sm:w-auto mt-2 sm:mt-0">
                    {step?.isCompleted ? (
                      <span className="text-[11px] font-bold text-emerald-500 uppercase  tracking-widest px-3 py-1 bg-emerald-50 rounded">
                        COMPLETED
                      </span>
                    ) : (
                      <CustomButton
                        size="sm"
                        variant="secondary"
                        className="text-center flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 border-none shadow-none font-medium text-[13px] px-4 w-full sm:w-auto"
                        onClick={() => navigate(step?.route)}
                      >
                        Complete Now
                      </CustomButton>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

    </div>
  );
};
export default React.memo(GettingStarted);
