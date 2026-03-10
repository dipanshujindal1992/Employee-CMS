import React, { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constant/routes";
import { useSelector } from "react-redux";
import clsx from "clsx";

import type { RootState } from "../../redux/store";
import type { Earning } from "../../redux/services/earningSlice";

import SalaryHeader from "./salary-details/SalaryHeader";
import EarningsTableHeader from "./salary-details/EarningsTableHeader";
import EarningRow from "./salary-details/EarningRow";
import FixedAllowanceRow from "./salary-details/FixedAllowanceRow";
import AddEarningDropdown from "./salary-details/AddEarningDropdown";
import NegativeBalanceBanner from "./salary-details/NegativeBalanceBanner";
import SalaryFooter from "./salary-details/SalaryFooter";

export interface EarningItem {
  id: string;
  name: string;
  type: string;
  value: string;
  amount?: number;
  derivedType?: string;
  componentId?: string;
}

export interface EmployeeFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
  dateofJoining: string;
  workEmail: string;
  phone: string;
  gender: string;
  locationId: string;
  designationId: string;
  departmentId: string;
  annualCTC: string;
  basicSalary: string;
  fixedAllowance: string;
  earnings: EarningItem[];
  email: string;
  dob: string;
  fatherName: string;
  pan: string;
  adharNumber: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  reAccountNumber: string;
  ifscCode: string;
  accountType: string;
}

interface Step2Props {
  formData: Partial<EmployeeFormData>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
  setIsDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
  errors?: Record<string, string>;
}

const Step2SalaryDetails: React.FC<Step2Props> = ({
  formData,
  handleInputChange,
  setFormData,
  setIsDisabled,
  errors,
}) => {
  const navigate = useNavigate();
  const salaryEarningList = useSelector(
    (state: RootState) => state?.earning?.salaryEarningList
  );

  const [isAddEarningOpen, setIsAddEarningOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* =========================
     Memoized Options
  ========================== */
  const basicOptions = useMemo(() => {
    return (
      salaryEarningList
        ?.filter((item: Earning) =>
          (typeof item?.earningId === 'object' && item?.earningId?.name === "Basic") ||
          (typeof item?.earningId === 'string' && item?.earningType === "Basic")
        )
        ?.map((item: Earning) => ({
          label: item?.earningName ?? (typeof item?.earningId === 'object' ? item?.earningId?.name : null) ?? "",
          value: item?._id ?? "",
          isFlatAmount: item?.isFlatAmount ?? false,
          earningType: "Basic",
          amount: item?.amount ?? 0
        })) || []
    );
  }, [salaryEarningList]);

  const hraOptions = useMemo(() => {
    return (
      salaryEarningList
        ?.filter((item: Earning) =>
          (typeof item?.earningId === 'object' && item?.earningId?.name === "House Rent Allowance") ||
          (typeof item?.earningId === 'string' && item?.earningType === "House Rent Allowance")
        )
        ?.map((item: Earning) => ({
          label: item?.earningName ?? (typeof item?.earningId === 'object' ? item?.earningId?.name : null) ?? "",
          value: item?._id ?? "",
          isFlatAmount: item?.isFlatAmount ?? false,
          earningType: "House Rent Allowance",
          amount: item?.amount ?? 0
        })) || []
    );
  }, [salaryEarningList]);

  const conveyanceOptions = useMemo(() => {
    return (
      salaryEarningList
        ?.filter((item: Earning) =>
          (typeof item?.earningId === 'object' && item?.earningId?.name === "Conveyance Allowance") ||
          (typeof item?.earningId === 'string' && item?.earningType === "Conveyance Allowance")
        )
        ?.map((item: Earning) => ({
          label: item?.earningName ?? (typeof item?.earningId === 'object' ? item?.earningId?.name : null) ?? "",
          value: item?._id ?? "",
          isFlatAmount: item?.isFlatAmount ?? false,
          earningType: "Conveyance Allowance",
          amount: item?.amount ?? 0
        })) || []
    );
  }, [salaryEarningList]);

  const customAllowanceOptions = useMemo(() => {
    const excludedCategories = ["Basic", "House Rent Allowance", "Conveyance Allowance"];
    return (
      salaryEarningList
        ?.filter((item: Earning) => {
          const categoryName = typeof item?.earningId === 'object' ? item?.earningId?.name : item?.earningType;
          return !excludedCategories.includes(categoryName ?? "");
        })
        ?.map((item: Earning) => ({
          label: item?.earningName ?? (typeof item?.earningId === 'object' ? item?.earningId?.name : null) ?? "",
          value: item?._id ?? "",
          isFlatAmount: item?.isFlatAmount ?? false,
          type: item?.isFlatAmount ? "Fixed amount" : "% of Basic",
          amount: item?.amount ?? 0
        })) || []
    );
  }, [salaryEarningList]);


  /* =========================
     Salary Calculation (Memoized)
  ========================== */

  const ctc = useMemo(
    () => parseFloat(formData?.annualCTC || "0") || 0,
    [formData?.annualCTC]
  );

  const { stage2Earnings, fixedAllowanceAmountMonthly, fixedAllowanceAmountAnnual } = useMemo(() => {
    const earnings = formData?.earnings || [];
    let monthlyBasicAmount = 0;

    // First, derive the monthly CTC
    const monthlyCtc = ctc / 12;

    const stage1 = earnings?.map((earning: EarningItem) => {
      let monthlyAmount = 0;
      let earningType = earning?.type;

      const isBasic = earning?.id === "basic";
      const isHRA = earning?.id === "hra_group";
      const isConveyance = earning?.id === "conveyance_group";

      if (isHRA) {
        const opt = hraOptions?.find(o => o.value === earning.name);
        earningType = opt?.isFlatAmount ? "Fixed amount" : "% of Basic";
      } else if (isConveyance) {
        const opt = conveyanceOptions?.find(o => o.value === earning.name);
        earningType = opt?.isFlatAmount ? "Fixed amount" : "% of Basic";
      } else if (isBasic) {
        const basicOpt = basicOptions?.find(
          (opt) => opt.value === earning?.name
        );
        if (basicOpt)
          earningType = basicOpt.isFlatAmount
            ? "Fixed amount"
            : "% of CTC";
      }

      const val = parseFloat(earning?.value || "0") || 0;
      if (earningType === "% of CTC") {
        monthlyAmount = Math.round(monthlyCtc * (val / 100));
      } else if (earningType === "Fixed amount") {
        monthlyAmount = val;
      }

      if (isBasic) monthlyBasicAmount = monthlyAmount;

      return {
        ...earning,
        monthlyAmount,
        amount: monthlyAmount * 12,
        derivedType: earningType
      };
    });

    const stage2 = stage1?.map((earning: EarningItem & { monthlyAmount: number }) => {
      if (earning?.derivedType === "% of Basic") {
        const val = parseFloat(earning?.value || "0") || 0;
        const monthlyAmount = Math.round(monthlyBasicAmount * (val / 100));
        return { ...earning, monthlyAmount, amount: monthlyAmount * 12 };
      }
      return earning;
    });

    const sumOtherMonthly = stage2?.reduce(
      (acc: number, curr: any) => acc + (curr?.monthlyAmount || 0),
      0
    );

    // Zoho computes fixed allowance by matching the rounded monthly CTC
    const roundedMonthlyCtc = Math.round(ctc / 12);
    const fixedAllowanceMonthly = roundedMonthlyCtc - sumOtherMonthly;

    return {
      stage2Earnings: stage2,
      fixedAllowanceAmountMonthly: fixedAllowanceMonthly,
      fixedAllowanceAmountAnnual: fixedAllowanceMonthly * 12,
    };
  }, [formData?.earnings, ctc, basicOptions]);

  const isNegativeBalance = useMemo(
    () => fixedAllowanceAmountAnnual < 0,
    [fixedAllowanceAmountAnnual]
  );

  const isBasicSelected = useMemo(
    () =>
      formData?.earnings?.some(
        (e: EarningItem) => e?.id === "basic" && e?.name && e?.name !== ""
      ),
    [formData?.earnings]
  );

  const isSetupInvalid = useMemo(
    () => isNegativeBalance || !isBasicSelected,
    [isNegativeBalance, isBasicSelected]
  );

  /* =========================
     Memoized Handlers
  ========================== */

  const handleEarningChange = useCallback(
    (id: string, field: keyof EarningItem, value: string | number) => {
      setFormData((prev: EmployeeFormData) => {
        const updatedEarnings = prev?.earnings?.map((e: EarningItem) => {
          if (e?.id === id) {
            const updated = { ...e, [field]: value };

            // If the name (selection) is changing, pre-fill the value/amount from API
            if (field === "name") {
              const allOpts = [...basicOptions, ...hraOptions, ...conveyanceOptions];
              const selectedOpt = allOpts.find(opt => opt.value === value);
              if (selectedOpt) {
                updated.value = String(selectedOpt.amount || "0");
                updated.type = selectedOpt.isFlatAmount ? "Fixed amount" : (id === "basic" ? "% of CTC" : "% of Basic");
                updated.componentId = String(value); // The value is the _id
              }
            }
            return updated;
          }
          return e;
        }) || [];

        return { ...prev, earnings: updatedEarnings };
      });
    },
    [setFormData, basicOptions, hraOptions, conveyanceOptions]
  );

  const handleRemoveEarning = useCallback(
    (id: string) => {
      setFormData((prev: EmployeeFormData) => ({
        ...prev,
        earnings: prev?.earnings?.filter((e: EarningItem) => e?.id !== id) || [],
      }));
    },
    [setFormData]
  );

  const toggleAddEarning = useCallback(() => {
    setIsAddEarningOpen((prev) => !prev);
  }, []);

  const handleAddHRA = useCallback(() => {
    const defaultOpt = hraOptions?.[0];
    setFormData((prev: EmployeeFormData) => ({
      ...prev,
      earnings: [
        ...(prev?.earnings || []),
        {
          id: "hra_group",
          name: defaultOpt?.value || "",
          type: defaultOpt?.isFlatAmount ? "Fixed amount" : "% of Basic",
          value: String(defaultOpt?.amount || "0"),
          componentId: defaultOpt?.value || ""
        }
      ]
    }));
    setIsAddEarningOpen(false);
  }, [hraOptions, setFormData]);

  const handleAddConveyance = useCallback(() => {
    const defaultOpt = conveyanceOptions?.[0];
    setFormData((prev: EmployeeFormData) => ({
      ...prev,
      earnings: [
        ...(prev?.earnings || []),
        {
          id: "conveyance_group",
          name: defaultOpt?.value || "",
          type: defaultOpt?.isFlatAmount ? "Fixed amount" : "% of Basic",
          value: String(defaultOpt?.amount || "0"),
          componentId: defaultOpt?.value || ""
        }
      ]
    }));
    setIsAddEarningOpen(false);
  }, [conveyanceOptions, setFormData]);

  const handleAddOther = useCallback((item: { label: string; value: string; type: string; amount?: number }) => {
    setFormData((prev: EmployeeFormData) => ({
      ...prev,
      earnings: [
        ...(prev?.earnings || []),
        {
          id: `custom_${item.value}`,
          name: item.label,
          type: item.type,
          value: String(item?.amount || "0"),
          componentId: item.value
        }
      ]
    }));
    setIsAddEarningOpen(false);
  }, [setFormData]);

  const handleEarningValueChange = useCallback((id: string, isPercentage: boolean, e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (isPercentage) {
      if (val.length > 3) {
        val = val.slice(0, 3);
      }
      const numVal = Number(val);
      if (val !== "" && numVal > 100) {
        val = "100";
      } else if (val !== "" && numVal < 0) {
        val = "0";
      }
    }
    handleEarningChange(id, "value", val);
  }, [handleEarningChange]);

  /* =========================
     Disable Effect
  ========================== */

  useEffect(() => {
    if (setIsDisabled) setIsDisabled(isSetupInvalid);
    return () => {
      if (setIsDisabled) setIsDisabled(false);
    };
  }, [isSetupInvalid, setIsDisabled]);

  /* =========================
     Click Outside
  ========================== */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsAddEarningOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasHRA = useMemo(() => {
    return !!formData?.earnings?.some(
      (e: EarningItem) => e?.id === "hra_group"
    );
  }, [formData?.earnings]);

  const hasConveyance = useMemo(() => {
    return !!formData?.earnings?.some(
      (e: EarningItem) => e?.id === "conveyance_group"
    );
  }, [formData?.earnings]);

  const earningsList = useMemo(() => {
    return (stage2Earnings || []).map((earning, index) => (
      <EarningRow
        key={earning?.id}
        earning={earning}
        index={index}
        basicOptions={basicOptions}
        hraOptions={hraOptions}
        conveyanceOptions={conveyanceOptions}
        handleEarningChange={handleEarningChange}
        handleRemoveEarning={handleRemoveEarning}
        handleEarningValueChange={handleEarningValueChange}
        navigate={navigate}
        ROUTES={ROUTES}
      />
    ));
  }, [
    stage2Earnings,
    basicOptions,
    hraOptions,
    conveyanceOptions,
    handleEarningChange,
    handleRemoveEarning,
    handleEarningValueChange,
    navigate
  ]);

  return (
    <div className="max-w-[1000px] mx-auto">
      <SalaryHeader
        formData={formData}
        handleInputChange={handleInputChange}
        errors={errors}
      />

      <div className={clsx(
        "border border-slate-200 rounded min-h-[300px] bg-white shadow-sm",
        isAddEarningOpen ? "overflow-visible" : "overflow-x-auto"
      )}>
        <div className="min-w-[760px]">
          <EarningsTableHeader />

          {/* Section Header */}
          <div className="px-6 py-4 text-sm font-semibold text-slate-800 border-b border-slate-100">
            Earnings<span className="text-red-500 ml-0.5">*</span>
          </div>

          {/* Dynamic Earnings List */}
          <div className="divide-y divide-slate-100">
            {earningsList}
          </div>

          <FixedAllowanceRow
            fixedAllowanceAmountMonthly={fixedAllowanceAmountMonthly}
            fixedAllowanceAmountAnnual={fixedAllowanceAmountAnnual}
          />

          <AddEarningDropdown
            hraOptions={hraOptions}
            conveyanceOptions={conveyanceOptions}
            customAllowanceOptions={customAllowanceOptions}
            formData={formData}
            isAddEarningOpen={isAddEarningOpen}
            toggleAddEarning={toggleAddEarning}
            handleAddHRA={handleAddHRA}
            handleAddConveyance={handleAddConveyance}
            handleAddOther={handleAddOther}
            hasHRA={hasHRA}
            hasConveyance={hasConveyance}
            dropdownRef={dropdownRef}
          />

          {/* Negative Balance Error Banner */}
          {isNegativeBalance && (
            <NegativeBalanceBanner
              fixedAllowanceAmountMonthly={fixedAllowanceAmountMonthly}
              fixedAllowanceAmountAnnual={fixedAllowanceAmountAnnual}
            />
          )}

          <SalaryFooter ctc={ctc} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Step2SalaryDetails);
