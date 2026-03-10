import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { PenLine, X, AlertTriangle } from "lucide-react";
import Card from "../components/common/Card";
import { useDispatch, useSelector } from "react-redux";
import { employeeDetailsRequest } from "../redux/services/employeeSlice";
import type { RootState } from "../redux/store";
import SalaryDetailsView from "../components/employee-details/SalaryDetailsView";
import SalaryHistoryView from "../components/employee-details/SalaryHistoryView";
import { formatDateGB } from "../utils/commonFunctions";
import CustomButton from "../components/common/CustomButton";

const EmployeeProfile: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const employeeDetail = useSelector(
    (state: RootState) => state?.employee?.employeeDetails,
  );

  useEffect(() => {
    if (id) {
      const delay = setTimeout(() => {
        dispatch(employeeDetailsRequest(id));
      }, 200);

      return () => clearTimeout(delay);
    }
  }, [id, dispatch]);

  const incompleteStep = useMemo(() => {
    if (!employeeDetail?.employee) return null;
    const { employee, personalDetail } = employeeDetail;

    if (employee?.step2 === false) {
      return 2;
    }
    if (!personalDetail || Object.keys(personalDetail).length === 0) {
      return 3;
    }
    if (!employee?.paymentType) {
      return 4;
    }

    return null;
  }, [employeeDetail]);

  const maskAccountNumber = useCallback((accountNumber?: string | null) => {
    if (!accountNumber) return "-";

    const acc = accountNumber.toString();
    const lastThree = acc.slice(-3);
    const masked = "X".repeat(Math.max(0, acc.length - 3));

    return masked + lastThree;
  }, []);

  const handleTabClick = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const toggleAccountNumber = useCallback(() => {
    setShowAccountNumber((prev) => !prev);
  }, []);
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header with Breadcrumb-like Feel */}
      <div className="flex flex-wrap items-start justify-between gap-4">

        {/* Left Section */}
        <div className="flex items-center gap-4 min-w-0 flex-1">

          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl font-semibold shrink-0">
            {employeeDetail?.employee?.firstName?.charAt(0) || "E"}
          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h1 className="text-lg sm:text-2xl font-bold text-slate-800 truncate">
                {employeeDetail?.employee?.firstName}
              </h1>

              <span className="px-2 py-0.5 rounded border border-slate-200 text-slate-500 text-xs font-medium bg-slate-50 whitespace-nowrap">
                {employeeDetail?.employee?.designationId?.name || "-"}
              </span>

              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs font-medium whitespace-nowrap">
                {employeeDetail?.employee?.isActive ? "Active" : "InActive"}
              </span>

            </div>

            <p className="text-slate-500 text-sm mt-1 truncate">
              {employeeDetail?.employee?.workEmail}
            </p>

          </div>
        </div>

        {/* Right Section */}
        <div className="shrink-0">
          <Link
            to="/employees"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-red-500 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>

      </div>


      {incompleteStep && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <p className="text-orange-700 text-sm font-medium">
            This employee's profile is incomplete.{" "}
            <Link
              to={`/employees/wizard/${employeeDetail?.employee?._id}?step=${incompleteStep}&wizard=true`}
              className="text-blue-600 hover:text-blue-700 hover:underline ml-1"
            >
              Complete now
            </Link>
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-8">
        <div
          className={`pb-3 border-b-2 cursor-pointer transition-colors text-sm font-medium ${activeTab === "overview"
            ? "border-primary text-primary"
            : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          onClick={() => handleTabClick("overview")}
        >
          Overview
        </div>
        <div
          className={`pb-3 border-b-2 cursor-pointer transition-colors text-sm font-medium ${activeTab === "salary"
            ? "border-primary text-primary"
            : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          onClick={() => handleTabClick("salary")}

        >
          Salary Details
        </div>
        <div
          className={`pb-3 border-b-2 cursor-pointer transition-colors text-sm font-medium ${activeTab === "salaryHistory"
            ? "border-primary text-primary"
            : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          onClick={() => handleTabClick("salaryHistory")}
        >
          Salary History
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="relative overflow-visible">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Basic Information

                <Link to={`/employees/wizard/${id}?step=1`}>
                  <PenLine className="w-4 h-4 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
                </Link>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6">
              {/* Column 1 */}
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-slate-500 text-sm">Name</label>
                  <div className="col-span-2 text-slate-800 font-medium">
                    {employeeDetail?.employee?.firstName || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-slate-500 text-sm">
                    Email Address
                  </label>
                  <div className="col-span-2 text-slate-800 font-medium">
                    {employeeDetail?.employee?.workEmail || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-slate-500 text-sm">
                    Mobile Number
                  </label>
                  <div className="col-span-2 text-slate-800 font-medium">
                    {employeeDetail?.employee?.phone || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-slate-500 text-sm">
                    Date of Joining
                  </label>
                  <div className="col-span-2 text-slate-800 font-medium">
                    {formatDateGB(employeeDetail?.employee?.dateofJoining)}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-slate-500 text-sm">Gender</label>
                  <div className="col-span-2 text-slate-800 font-medium">
                    {employeeDetail?.employee?.gender || "-"}
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-slate-500 text-sm">
                    Work Location
                  </label>
                  <div className="col-span-2 text-slate-800 font-medium">
                    {employeeDetail?.employee?.locationId?.name || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-slate-500 text-sm">Designation</label>
                  <div className="col-span-2 text-slate-800 font-medium">
                    {employeeDetail?.employee?.designationId?.name || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-slate-500 text-sm">Departments</label>
                  <div className="col-span-2 text-slate-800 font-medium">
                    {employeeDetail?.employee?.departmentId?.name || "-"}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="relative overflow-visible">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Personal Information
                {employeeDetail?.personalDetail && (
                  <Link to={`/employees/wizard/${id}?step=3`}>
                    <PenLine className="w-4 h-4 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
                  </Link>
                )}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-slate-500 text-sm">
                    Date of Birth
                  </label>
                  <div className="col-span-2 text-slate-800 font-medium">
                    {formatDateGB(employeeDetail?.personalDetail?.dob) || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-slate-500 text-sm">
                    Father's Name
                  </label>
                  <div className="col-span-2 text-slate-800 font-medium">
                    {employeeDetail?.personalDetail?.fatherName || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-slate-500 text-sm">PAN</label>
                  <div className="col-span-2 text-slate-800 font-medium">
                    {employeeDetail?.personalDetail?.pan || "-"}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-slate-500 text-sm">
                    Email Address
                  </label>
                  <div className="col-span-2 text-slate-800 font-medium">
                    {employeeDetail?.personalDetail?.email || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-slate-500 text-sm">
                    Residential Address
                  </label>
                  <div className="col-span-2 text-slate-800 font-medium">
                    {[
                      employeeDetail?.personalDetail?.address1,
                      employeeDetail?.personalDetail?.city,
                      employeeDetail?.personalDetail?.pincode,
                      employeeDetail?.personalDetail?.state,
                    ]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Information */}
          <Card className="relative overflow-visible">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Payment Information
                {employeeDetail?.employee?.paymentType && (
                  <Link to={`/employees/wizard/${id}?step=4`}>
                    <PenLine className="w-4 h-4 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
                  </Link>
                )}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-slate-500 text-sm">Payment Mode</label>
                  <div className="col-span-2 text-slate-800 font-medium">
                    {employeeDetail?.employee?.paymentType || "-"}
                  </div>
                </div>
                {employeeDetail?.employee?.paymentType === "bank" && <div className="grid grid-cols-3 gap-4">
                  <label className="text-slate-500 text-sm">
                    Account Number
                  </label>
                  <div className="col-span-2 text-slate-800 font-medium flex gap-2 items-center">
                    {employeeDetail?.bankDetails?.accountNumber ? (
                      <div className="flex flex-wrap items-center gap-2">

                        <span className="break-all text-sm">
                          {showAccountNumber
                            ? employeeDetail?.bankDetails?.accountNumber
                            : maskAccountNumber(employeeDetail?.bankDetails?.accountNumber)}
                        </span>

                        <CustomButton
                          variant="none"
                          type="button"
                          onClick={toggleAccountNumber}
                          className="text-blue-600 text-xs sm:text-sm underline whitespace-nowrap"
                        >
                          {showAccountNumber ? "Hide" : "Show"}
                        </CustomButton>

                      </div>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>}
                {employeeDetail?.employee.paymentType === "bank" && (
                  <div className="grid grid-cols-3 gap-4">
                    <label className="text-slate-500 text-sm">
                      Account Holder Name
                    </label>
                    <div className="col-span-2 text-slate-800 font-medium">
                      {employeeDetail?.bankDetails?.name || "-"}
                    </div>
                  </div>
                )}
              </div>
              {employeeDetail?.employee.paymentType === "bank" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <label className="text-slate-500 text-sm">Bank Name</label>
                    <div className="col-span-2 text-slate-800 font-medium">
                      {employeeDetail?.bankDetails?.bankName || "-"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <label className="text-slate-500 text-sm">IFSC</label>
                    <div className="col-span-2 text-slate-800 font-medium">
                      {employeeDetail?.bankDetails?.ifsc || "-"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <label className="text-slate-500 text-sm">
                      Account Type
                    </label>
                    <div className="col-span-2 text-slate-800 font-medium">
                      {employeeDetail?.bankDetails?.type || "-"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "salary" && (
        <SalaryDetailsView employeeDetail={employeeDetail} />
      )}

      {activeTab === "salaryHistory" && id && (
        <SalaryHistoryView employeeId={id} />
      )}
    </div>
  );
};
export default React.memo(EmployeeProfile);
