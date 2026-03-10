import { PenLine, Download, X, ChevronDown, Pencil, Trash2 } from "lucide-react";
import React, { useCallback, useRef, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import CustomButton from "../common/CustomButton";
import Modal from "../common/Modal";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import AddDeductionModal, { type DeductionSaveData } from "./AddDeductionModal";
import { recurringDeductionListRequest, addEmployeeDeductionRequest, updateEmployeeDeductionRequest, deleteEmployeeDeductionRequest } from "../../redux/services/deductionSlice";
import { employeeDetailsRequest } from "../../redux/services/employeeSlice";
import { fetchSalaryCategoryRequest } from "../../redux/services/salaryComponentSlice";
import { formatDateIN } from "../../utils/commonFunctions";

interface EmployeeData {
  _id?: string;
  ctc?: number | string;
  firstName?: string;
  lastName?: string;
  employeeId?: string;
  dateofJoining?: string | Date;
  designationId?: { name?: string };
}

interface SalaryData {
  basicSalary?: number | string;
  fixedAllowance?: number | string;
}

interface CustomAllowance {
  customAllowanceId?: string | { _id: string; earningName: string; isFlatAmount: boolean };
  customAllowanceAmount?: number | string;
  customAllowanceAmountMonthly?: number | string;
}

interface EarningData {
  basicAmount?: number | string;
  hraAmount?: number | string;
  conveyanceAmount?: number | string;
  customAllowances?: CustomAllowance[];
  deductions?: Array<{
    _id?: string;
    deductionId: string | { _id: string; slipName: string; deductionFrequency?: string };
    deductionAmount: number | string;
    deductionType: string;
    deductionEnds?: string;
    deductionEndsValue?: string;
    deductionEndsAmountRecovered?: string | null;
    amountDeducted?: number;
  }>;
}

interface SalaryDetailsProps {
  employeeDetail?: {
    employee?: EmployeeData;
    salaryDetails?: SalaryData;
    earningDetails?: EarningData;
  } | null;
}
const SalaryDetailsView: React.FC<SalaryDetailsProps> = ({ employeeDetail }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const userData = useSelector((state: RootState) => state.auth.userData);
  const dispatch = useDispatch();
  const deductionList = useSelector((state: RootState) => state.deduction.deductionList);

  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showDeductionModal, setShowDeductionModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const apiRecurringDeductions = useSelector((state: RootState) => state.deduction.recurringDeductionList) || [];
  const successMessage = useSelector((state: RootState) => state.deduction.successMessage);
  const errorMessage = useSelector((state: RootState) => state.deduction.errorMessage);
  const isLoadingRedux = useSelector((state: RootState) => state.deduction.loading);

  const [deductionToDelete, setDeductionToDelete] = useState<string | null>(null);
  const [editingDeduction, setEditingDeduction] = useState<{ id: string, data: DeductionSaveData & { deductionName?: string } } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(recurringDeductionListRequest());
    dispatch(fetchSalaryCategoryRequest({}));
  }, [dispatch]);

  const salaryCategories = useSelector((state: RootState) => state.salaryComponent.salaryCategories);
  const deductionCategoryId = useMemo(() => {
    return salaryCategories?.find(c => c.name?.toLowerCase() === "deduction" || c.name?.toLowerCase() === "deductions")?._id;
  }, [salaryCategories]);

  const recurringDeductions = useMemo(() =>
    Array.isArray(deductionList) ? deductionList.filter(d => d.deductionFrequency === "recurring") : [],
    [deductionList]
  );

  // Map to include deductionFrequency for the modal
  const recurringDeductionOptions = useMemo(() =>
    apiRecurringDeductions?.map(d => ({
      _id: d?._id,
      slipName: d?.slipName,
      deductionFrequency: d?.deductionFrequency || "recurring",
    })),
    [apiRecurringDeductions]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAddDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isLoading && !isLoadingRedux) {
      if (successMessage) {
        toast.success(successMessage);
        setShowDeductionModal(false);
        setEditingDeduction(null);
        setDeductionToDelete(null);
        setIsLoading(false);

        // Refresh details
        const employeeId = employeeDetail?.employee?._id;
        if (employeeId) {
          dispatch(employeeDetailsRequest(employeeId));
        }
      } else if (errorMessage) {
        toast.error(errorMessage);
        setIsLoading(false);
      }
    }
  }, [isLoading, isLoadingRedux, successMessage, errorMessage, dispatch, employeeDetail?.employee?._id]);

  const toggleAddDropdown = useCallback(() => {
    setShowAddDropdown(prev => !prev);
  }, []);

  const handleAddDeductionClick = useCallback(() => {
    setShowAddDropdown(false);
    setEditingDeduction(null);
    setShowDeductionModal(true);
  }, []);

  const handleEditDeductionClick = useCallback((id: string, ded: any) => {
    let deductionIdVal = "";
    let slipNameVal = "";

    if (typeof ded.deductionId === "object" && ded.deductionId !== null) {
      deductionIdVal = ded.deductionId._id;
      slipNameVal = ded.deductionId.slipName || "";
    } else {
      // Must be a custom deduction lacking an object _id mapping (e.g., custom slipName passed on creation)
      deductionIdVal = ded.deductionId;
      slipNameVal = ded.deductionId;
    }

    setEditingDeduction({
      id,
      data: {
        deductionId: deductionIdVal,
        deductionName: slipNameVal,
        deductionAmount: ded.deductionAmount,
        deductionType: ded.deductionType as "fixed" | "percentage",
        deductionEnds: ded.deductionEnds as "neverEnds" | "timeEnds" | "amountRecovered",
        deductionEndsValue: ded.deductionEndsValue,
        deductionEndsAmountRecovered: ded.deductionEndsAmountRecovered,
      }
    });
    setShowDeductionModal(true);
  }, []);

  const handleDeductionSave = useCallback((data: DeductionSaveData) => {
    const employeeId = employeeDetail?.employee?._id;
    if (!employeeId) {
      toast.error("Employee not found");
      return;
    }

    setIsLoading(true);

    if (editingDeduction) {
      dispatch(
        updateEmployeeDeductionRequest({
          id: editingDeduction.id,
          data: {
            employeeId,
            deductionAmount: data.deductionAmount,
            deductionType: data.deductionType,
            deductionEnds: data.deductionEnds,
            deductionEndsValue: data.deductionEndsValue,
            deductionEndsAmountRecovered: data.deductionEndsAmountRecovered,
          }
        })
      );
    } else {
      if (data.isNew) {
        dispatch(
          addEmployeeDeductionRequest({
            employeeId,
            slipName: data.deductionId,
            categoryId: deductionCategoryId,
            deductionAmount: data.deductionAmount,
            deductionType: data.deductionType,
            deductionEnds: data.deductionEnds,
            deductionEndsValue: data.deductionEndsValue,
            deductionEndsAmountRecovered: data.deductionEndsAmountRecovered,
          })
        );
      } else {
        dispatch(
          addEmployeeDeductionRequest({
            employeeId,
            deductionId: data.deductionId,
            deductionAmount: data.deductionAmount,
            deductionType: data.deductionType,
            deductionEnds: data.deductionEnds,
            deductionEndsValue: data.deductionEndsValue,
            deductionEndsAmountRecovered: data.deductionEndsAmountRecovered,
          })
        );
      }
    }

  }, [dispatch, employeeDetail?.employee?._id, editingDeduction, deductionCategoryId]);

  const confirmDeleteDeduction = useCallback(() => {
    if (!deductionToDelete) return;
    const employeeId = employeeDetail?.employee?._id;
    if (employeeId) {
      setIsLoading(true);
      dispatch(
        deleteEmployeeDeductionRequest({
          deductionId: deductionToDelete,
          employeeId: employeeId,
        })
      );
    }
  }, [deductionToDelete, employeeDetail?.employee?._id, dispatch]);

  const handleDownloadPDF = useCallback(async () => {
    if (!printRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(printRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const rect = printRef.current.getBoundingClientRect();
      const canvasWidth = rect.width;
      const canvasHeight = rect.height;

      const padding = 20;
      const contentWidth = pdfWidth - padding * 2;
      const contentHeight = (canvasHeight * contentWidth) / canvasWidth;

      const companyName = userData?.name?.toUpperCase();
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 41, 59);
      pdf.text(companyName || "", padding, padding + 15);

      // Offset image down by 45 units to make room for header
      const imageOffset = 45;

      pdf.addImage(
        dataUrl,
        "PNG",
        padding,
        padding + imageOffset,
        contentWidth,
        contentHeight,
      );

      const pdfBlob = pdf.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfPreviewUrl(url);
    } catch (error) {
      toast.error(`Error generating PDF: ${error}`);
    } finally {
      setIsDownloading(false);
    }
  }, [userData]);

  const handleClosePreview = useCallback(() => {
    setPdfPreviewUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
  }, []);

  const {
    salaryDetails,
    annualCTC,
    basicInputValue,
    hraInputValue,
    monthlyCTC,
    monthlyBasic,
    annualBasic,
    monthlyHRA,
    annualHRA,
    monthlyConveyance,
    annualConveyance,
    customAllowances,
    monthlyFixedAllowance,
    annualFixedAllowance,
  } = useMemo(() => {
    const salaryDetails = employeeDetail?.employee;
    const annualCTC = Number(salaryDetails?.ctc || 0);

    const basicInputValue = Number(employeeDetail?.earningDetails?.basicAmount || 0);
    const hraInputValue = Number(employeeDetail?.earningDetails?.hraAmount || 0);
    const conveyanceInputValue = Number(employeeDetail?.earningDetails?.conveyanceAmount || 0);

    const monthlyCTC = annualCTC / 12;
    const roundedMonthlyCTC = Math.round(monthlyCTC);

    const monthlyBasic = Math.round(monthlyCTC * (basicInputValue / 100));
    const annualBasic = monthlyBasic * 12;

    const monthlyHRA = Math.round(monthlyBasic * (hraInputValue / 100));
    const annualHRA = monthlyHRA * 12;

    const monthlyConveyance = conveyanceInputValue;
    const annualConveyance = monthlyConveyance * 12;

    const customAllowances = employeeDetail?.earningDetails?.customAllowances || [];
    const totalMonthlyCustomAllowance = customAllowances.reduce((sum, ca) => sum + Number(ca.customAllowanceAmountMonthly || 0), 0);

    const monthlyFixedAllowance = roundedMonthlyCTC - (monthlyBasic + monthlyHRA + monthlyConveyance + totalMonthlyCustomAllowance);
    const annualFixedAllowance = monthlyFixedAllowance * 12;

    return {
      salaryDetails,
      annualCTC,
      basicInputValue,
      hraInputValue,
      monthlyCTC,
      monthlyBasic,
      annualBasic,
      monthlyHRA,
      annualHRA,
      monthlyConveyance,
      annualConveyance,
      customAllowances,
      monthlyFixedAllowance,
      annualFixedAllowance,
    };
  }, [employeeDetail]);
  const handleDownload = useCallback(() => {
    if (!pdfPreviewUrl) return;

    const link = document.createElement("a");
    link.href = pdfPreviewUrl;
    link.download = `Salary_Details_${salaryDetails?._id || "employee"}.pdf`;
    link.click();
  }, [pdfPreviewUrl, salaryDetails?._id]);
  const handleCloseDeductionModal = useCallback(() => {
    setShowDeductionModal(false);
  }, []);


  const deductionRows = useMemo(() => {
    if (!employeeDetail?.earningDetails?.deductions || employeeDetail.earningDetails.deductions.length === 0) {
      return (
        <div className="py-6 text-center text-sm text-slate-400">
          No deductions added yet
        </div>
      );
    }

    return employeeDetail?.earningDetails?.deductions?.map((ded, idx) => {
      const deductionIdObj = ded.deductionId;

      const deductionName =
        typeof deductionIdObj === "object" && deductionIdObj !== null
          ? deductionIdObj.slipName
          : (recurringDeductions.find(d => d._id === deductionIdObj)?.slipName ||
            String(deductionIdObj));

      const calcLabel =
        ded.deductionType === "percentage"
          ? `${ded.deductionAmount}% of Basic`
          : `Fixed Amount of ₹${Number(ded.deductionAmount || 0).toFixed(2)}`;

      const amountDeducted = Number(ded.amountDeducted || 0).toFixed(2);

      return (
        <div
          key={ded._id || idx}
          className="grid grid-cols-12 gap-4 py-3 border-b border-slate-100 items-center px-2"
        >
          <div className="col-span-5">
            <div className="text-sm text-slate-700 font-medium">
              {deductionName}
            </div>
            <div className="text-xs text-slate-400">
              (₹{amountDeducted} has been deducted)
            </div>
          </div>

          <div className="col-span-5 text-sm text-blue-600 font-medium">
            {calcLabel}
          </div>

          <div className="col-span-2 flex justify-end gap-3">
            <CustomButton className="text-slate-400 hover:text-primary transition-colors" variant="none" onClick={() => handleEditDeductionClick(ded._id!, ded)}>
              <Pencil className="w-4 h-4" />
            </CustomButton>
            <CustomButton className="text-slate-400 hover:text-red-500 transition-colors" variant="none" onClick={() => setDeductionToDelete(ded._id!)}>
              <Trash2 className="w-4 h-4" />
            </CustomButton>
          </div>
        </div>
      );
    });
  }, [employeeDetail?.earningDetails?.deductions, recurringDeductions]);


  const allowanceRows = useMemo(() => {
    return (
      <>
        {/* Custom Allowances */}
        {customAllowances?.map((ca, index) => {
          const caMonthly = Number(ca.customAllowanceAmountMonthly || 0);
          const caAnnual = caMonthly * 12;
          if (caAnnual <= 0) return null;

          const caName =
            (typeof ca.customAllowanceId === "object"
              ? ca.customAllowanceId?.earningName
              : "Custom Allowance") || "Custom Allowance";

          const caValue = Number(ca.customAllowanceAmount || 0);

          const isCaFlat =
            typeof ca.customAllowanceId === "object"
              ? ca.customAllowanceId?.isFlatAmount
              : true;

          return (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 
            py-3 border-b border-slate-100 items-start sm:items-center px-2"
            >
              {/* Info */}
              <div className="sm:col-span-6">
                <div className="text-sm text-slate-700 font-medium">
                  {caName}
                </div>
                <div className="text-xs text-slate-400">
                  {isCaFlat
                    ? "(Fixed Amount)"
                    : `(${caValue.toFixed(2)} % of Basic Amount)`}
                </div>
              </div>

              {/* Monthly */}
              <div className="sm:col-span-3 sm:text-right text-sm text-slate-700 font-medium">
                <span className="sm:hidden block text-xs text-slate-400">
                  Monthly Amount
                </span>
                ₹
                {caMonthly.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>

              {/* Annual */}
              <div className="sm:col-span-3 sm:text-right text-sm text-slate-700 font-medium">
                <span className="sm:hidden block text-xs text-slate-400">
                  Annual Amount
                </span>
                ₹
                {caAnnual.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          );
        })}

        {/* Fixed Allowance */}
        {annualFixedAllowance > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 
          py-3 border-b border-slate-100 items-start sm:items-center px-2"
          >
            <div className="sm:col-span-6">
              <div className="text-sm text-slate-700 font-medium">
                Fixed Allowance
              </div>
            </div>

            <div className="sm:col-span-3 sm:text-right text-sm text-slate-700 font-medium">
              <span className="sm:hidden block text-xs text-slate-400">
                Monthly Amount
              </span>
              ₹
              {monthlyFixedAllowance.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>

            <div className="sm:col-span-3 sm:text-right text-sm text-slate-700 font-medium">
              <span className="sm:hidden block text-xs text-slate-400">
                Annual Amount
              </span>
              ₹
              {annualFixedAllowance.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        )}
      </>
    );
  }, [customAllowances, annualFixedAllowance, monthlyFixedAllowance]);
  const handleClose = useCallback(() => {
    setDeductionToDelete(null);
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2 text-sm">
        <div className="relative" ref={dropdownRef}>
          <CustomButton
            onClick={toggleAddDropdown}
            className="flex items-center gap-2 px-4 py-2 font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            Add <ChevronDown className="w-4 h-4" />
          </CustomButton>

          {showAddDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-10 transition-all font-medium">
              <CustomButton
                variant="ghost"
                className="w-full text-left px-4 py-2 text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors focus:outline-none"
                onClick={handleAddDeductionClick}
              >
                Deduction
              </CustomButton>
            </div>
          )}
        </div>

        <CustomButton
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 font-medium text-white bg-primary rounded-md hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isDownloading ? "Generating PDF..." : "Download PDF"}
        </CustomButton>
      </div>

      <div ref={printRef} className="space-y-6 bg-white p-2">
        {isDownloading && (
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-4">
            <div className="flex gap-12">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Employee Name
                </p>
                <p className="text-base font-bold text-slate-800">
                  {salaryDetails?.firstName
                    ? `${salaryDetails?.firstName} ${salaryDetails?.lastName || ""} (${salaryDetails?.employeeId || "-"})`
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Date of Joining
                </p>
                <p className="text-base font-medium text-slate-800">
                  {formatDateIN(salaryDetails?.dateofJoining)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Designation
                </p>
                <p className="text-base font-medium text-slate-800">
                  {salaryDetails?.designationId?.name || "-"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Generated On
              </p>
              <p className="text-base font-medium text-slate-800">
                {formatDateIN(salaryDetails?.dateofJoining)}
              </p>
            </div>
          </div>
        )}

        {/* CTC Summary Card */}
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-slate-200">

          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-slate-800">
                Salary Details
              </span>

              {salaryDetails?.ctc && !isDownloading && (
                <Link to={`/employees/wizard/${salaryDetails?._id}?step=2`}>
                  <PenLine className="w-4 h-4 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
                </Link>
              )}
            </div>
          </div>

          {/* Responsive CTC Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-16">

            {/* Annual CTC */}
            <div>
              <div className="text-xs text-slate-500 mb-1">
                Annual CTC
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-800">
                ₹
                {annualCTC.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <span className="text-xs font-normal text-slate-500">
                  per year
                </span>
              </div>
            </div>

            {/* Monthly CTC */}
            <div>
              <div className="text-xs text-slate-500 mb-1">
                Monthly CTC
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-800">
                ₹
                {Math.round(monthlyCTC).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <span className="text-xs font-normal text-slate-500">
                  per month
                </span>
              </div>
            </div>

          </div>
        </div>



        {/* Salary Structure Card */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800">
              Salary Structure
            </h3>
          </div>

          <div className="p-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              SALARY COMPONENTS
            </div>

            {/* Header */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 
                text-xs font-medium text-slate-400 mb-4 px-2">

              <div className="sm:col-span-6">
                Earnings
              </div>

              <div className="sm:col-span-3 sm:text-right">
                MONTHLY AMOUNT
              </div>

              <div className="sm:col-span-3 sm:text-right">
                ANNUAL AMOUNT
              </div>

            </div>

            {/* Basic */}
            {annualBasic > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 
                  py-3 border-b border-slate-100 items-start sm:items-center px-2">

                {/* Basic Name Section */}
                <div className="sm:col-span-6">
                  <div className="text-sm text-slate-700 font-medium">
                    Basic
                  </div>
                  <div className="text-xs text-slate-400">
                    ({basicInputValue.toFixed(2)} % of CTC)
                  </div>
                </div>

                {/* Monthly Amount */}
                <div className="sm:col-span-3 sm:text-right text-sm text-slate-700 font-medium">
                  <span className="sm:hidden text-xs text-slate-400 block">
                    Monthly Amount
                  </span>
                  ₹
                  {monthlyBasic.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>

                {/* Annual Amount */}
                <div className="sm:col-span-3 sm:text-right text-sm text-slate-700 font-medium">
                  <span className="sm:hidden text-xs text-slate-400 block">
                    Annual Amount
                  </span>
                  ₹
                  {annualBasic.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>

              </div>
            )}

            {/* House Rent Allowance */}
            {annualHRA > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 
                  py-3 border-b border-slate-100 items-start sm:items-center px-2">

                {/* HRA Info */}
                <div className="sm:col-span-6">
                  <div className="text-sm text-slate-700 font-medium">
                    House Rent Allowance
                  </div>
                  <div className="text-xs text-slate-400">
                    ({hraInputValue.toFixed(2)} % of Basic Amount)
                  </div>
                </div>

                {/* Monthly */}
                <div className="sm:col-span-3 sm:text-right text-sm text-slate-700 font-medium">
                  <span className="sm:hidden text-xs text-slate-400 block">
                    Monthly Amount
                  </span>
                  ₹
                  {monthlyHRA.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>

                {/* Annual */}
                <div className="sm:col-span-3 sm:text-right text-sm text-slate-700 font-medium">
                  <span className="sm:hidden text-xs text-slate-400 block">
                    Annual Amount
                  </span>
                  ₹
                  {annualHRA.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>

              </div>
            )}

            {/* Conveyance Allowance */}
            {annualConveyance > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 
                  py-3 border-b border-slate-100 items-start sm:items-center px-2">

                {/* Info */}
                <div className="sm:col-span-6">
                  <div className="text-sm text-slate-700 font-medium">
                    Conveyance Allowance
                  </div>
                  <div className="text-xs text-slate-400">
                    (Fixed Amount)
                  </div>
                </div>

                {/* Monthly */}
                <div className="sm:col-span-3 sm:text-right text-sm text-slate-700 font-medium">
                  <span className="sm:hidden block text-xs text-slate-400">
                    Monthly Amount
                  </span>
                  ₹
                  {monthlyConveyance.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>

                {/* Annual */}
                <div className="sm:col-span-3 sm:text-right text-sm text-slate-700 font-medium">
                  <span className="sm:hidden block text-xs text-slate-400">
                    Annual Amount
                  </span>
                  ₹
                  {annualConveyance.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>

              </div>
            )}

            {allowanceRows}

            {/* Total */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 
                py-4 mt-2 items-start sm:items-center px-2 
                border-t border-slate-200">

              {/* Title */}
              <div className="sm:col-span-6 font-bold text-slate-800 text-sm">
                Cost to Company
              </div>

              {/* Monthly CTC */}
              <div className="sm:col-span-3 sm:text-right font-bold text-slate-800 text-sm">
                <span className="sm:hidden block text-xs text-slate-400 font-medium">
                  Monthly Amount
                </span>
                ₹
                {Math.round(monthlyCTC).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>

              {/* Annual CTC */}
              <div className="sm:col-span-3 sm:text-right font-bold text-slate-800 text-sm">
                <span className="sm:hidden block text-xs text-slate-400 font-medium">
                  Annual Amount
                </span>
                ₹
                {annualCTC.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Other Deductions */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-800">Other Deductions</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-12 gap-4 py-2 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">
            <div className="col-span-5">Deduction Name</div>
            <div className="col-span-5">Calculation Type</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="px-2 pt-4 pb-1 text-sm font-semibold text-slate-700">Deductions</div>

          {deductionRows}
        </div>
      </div>

      <Modal
        isOpen={!!deductionToDelete}
        onClose={handleClose}
        title="Delete Deduction"
        size="sm"
        footer={(
          <div className="flex gap-3 justify-end w-full">
            <CustomButton variant="outline" onClick={handleClose}>Cancel</CustomButton>
            <CustomButton variant="primary" className="bg-red-500 hover:bg-red-600 border-none text-white" onClick={confirmDeleteDeduction}>Delete</CustomButton>
          </div>
        )}
      >
        <div className="py-2 text-slate-700">
          <p>Are you sure you want to delete this deduction? This action cannot be undone.</p>
        </div>
      </Modal>

      {pdfPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-xs sm:text-lg font-semibold">
                Salary Details PDF Preview
              </h3>
              <div className="flex gap-4 items-center">
                <CustomButton
                  variant="primary"
                  onClick={handleDownload}
                  className="px-2.5 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
                >
                  Download PDF
                </CustomButton>
                <CustomButton
                  onClick={handleClosePreview}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="w-3 h-3 sm:w-5 sm:h-5" />
                </CustomButton>
              </div>
            </div>
            <div className="flex-1 bg-slate-100">
              <iframe
                src={pdfPreviewUrl}
                title="PDF Preview"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Deduction Modal */}
      <div className="relative">
        <AddDeductionModal
          isOpen={showDeductionModal}
          onClose={handleCloseDeductionModal}
          onSave={handleDeductionSave}
          existingDeductions={recurringDeductionOptions}
          editData={editingDeduction?.data}
        />
        {isLoading && (
          <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center z-[100] rounded-lg">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(SalaryDetailsView);
