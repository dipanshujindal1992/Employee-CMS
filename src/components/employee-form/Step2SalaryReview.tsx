import React, { useCallback, useMemo } from "react";
import CustomButton from "../common/CustomButton";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

import type { EmployeeFormData, EarningItem } from "./Step2SalaryDetails";

interface Step2ReviewProps {
  formData: EmployeeFormData;
  setIsSalaryReview: (val: boolean) => void;
}

interface ProcessedEarningItem extends EarningItem {
  amount: number;
  monthlyAmount: number;
  derivedType: string;
}

const Step2SalaryReview: React.FC<Step2ReviewProps> = ({
  formData,
  setIsSalaryReview,
}) => {
  const salaryEarningList = useSelector((state: RootState) => state?.earning?.salaryEarningList)
  const basicOptions = useMemo(() => {
    return salaryEarningList?.map(item => ({
      label: item.earningName ?? "",
      value: item._id,
      isFlatAmount: item.isFlatAmount,
    }));
  }, [salaryEarningList]);

  const ctc = parseFloat(formData.annualCTC) || 0;
  const earnings = formData.earnings || [];
  const monthlyCtc = ctc / 12;

  const stage1Earnings = useMemo(() => {
    let monthlyBasicAmountTemp = 0;

    const result = earnings?.map((earning: EarningItem) => {
      let monthlyAmount = 0;
      let earningType = earning.type;

      const isBasic = earning.id === "basic";

      const selectedOpt = salaryEarningList?.find(
        opt => opt._id === earning.name || opt._id === earning.componentId
      );

      if (selectedOpt) {
        if (isBasic) {
          earningType = selectedOpt.isFlatAmount ? "Fixed amount" : "% of CTC";
        } else {
          earningType = selectedOpt.isFlatAmount ? "Fixed amount" : "% of Basic";
        }
      }

      const val = parseFloat(earning.value || "0") || 0;

      if (earningType === "% of CTC") {
        monthlyAmount = Math.round(monthlyCtc * (val / 100));
      } else if (earningType === "Fixed amount") {
        monthlyAmount = val;
      }

      if (isBasic) monthlyBasicAmountTemp = monthlyAmount;

      return {
        ...earning,
        monthlyAmount,
        amount: monthlyAmount * 12,
        derivedType: earningType
      };
    });

    return { result, monthlyBasicAmountTemp };

  }, [earnings, salaryEarningList, monthlyCtc]);

  const stage2Earnings = useMemo(() => {
    return stage1Earnings.result?.map((earning) => {
      if (earning.derivedType === "% of Basic") {
        const val = parseFloat(earning.value || "0") || 0;
        const monthlyAmount = Math.round(
          stage1Earnings.monthlyBasicAmountTemp * (val / 100)
        );

        return { ...earning, monthlyAmount, amount: monthlyAmount * 12 };
      }

      return earning;
    });
  }, [stage1Earnings]);
  const sumOtherMonthly = useMemo(() => {
    return stage2Earnings?.reduce(
      (acc: number, curr: any) => acc + (curr?.monthlyAmount || 0),
      0
    );
  }, [stage2Earnings]);
  const { fixedAllowanceMonthly, fixedAllowanceAnnual } = useMemo(() => {
    const roundedMonthlyCtc = Math.round(ctc / 12);
    const monthly = roundedMonthlyCtc - sumOtherMonthly;
    return {
      fixedAllowanceMonthly: monthly,
      fixedAllowanceAnnual: monthly * 12,
    };
  }, [ctc, sumOtherMonthly]);


  const formatMoney = useCallback((val: number) => {
  return val.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}, []);

  const handleEditClick = useCallback(() => {
    setIsSalaryReview(false);
  }, [setIsSalaryReview]);

  const renderedEarnings = useMemo(() => {
    return stage2Earnings?.map((earning: ProcessedEarningItem) => {
      return (
        <React.Fragment key={earning.id}>
          {/* Earning Row */}
          <div className="grid grid-cols-12 gap-4 py-4 border-b border-slate-100 items-center">
            <div className="col-span-6">
              <div className="font-medium text-slate-800">
                {basicOptions?.find(o => o.value === earning.name)?.label || earning.name}
              </div>
              <div className="text-[11px] text-slate-500">
                {earning.derivedType === "% of CTC" ? `${earning.value}% of CTC` :
                  earning.derivedType === "% of Basic" ? `${earning.value}% of Basic` :
                    "Fixed amount"}
              </div>
            </div>
            <div className="col-span-3 text-right font-mono text-slate-700">
              ₹ {formatMoney(earning.monthlyAmount)}
            </div>
            <div className="col-span-3 text-right font-mono text-slate-700">
              ₹ {formatMoney(earning.amount)}
            </div>
          </div>
        </React.Fragment>
      );
    });
  }, [stage2Earnings, basicOptions, formatMoney]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Salary Structure
            </h3>
            <p className="text-slate-500 text-sm">
              Set how the employee's salary is divided for accurate pay
              calculation.
            </p>
          </div>
          <CustomButton
            variant="outline"
            size="sm"
            onClick={handleEditClick}
            leftIcon={<span className="text-sm">Edit</span>}
          />
        </div>

        <div className="bg-slate-50 rounded-lg p-6 mb-8 flex flex-col sm:flex-row gap-6 sm:gap-12">
          <div className="text-center sm:text-left">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Annual CTC
            </div>
            <div className="text-xl font-bold text-slate-800">
              ₹ {formatMoney(ctc)}
            </div>
          </div>


          <div className="text-center sm:text-left">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Monthly CTC
            </div>
            <div className="text-xl font-bold text-slate-800">
              ₹ {formatMoney(Math.round(ctc / 12))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-full bg-slate-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 
                flex flex-col sm:flex-row 
                gap-6 sm:gap-12 
                overflow-hidden">

          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Annual CTC
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-800 break-words">
              ₹ {formatMoney(Math.round(ctc))}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              per year
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Monthly CTC
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-800 break-words">
              ₹ {formatMoney(Math.round(ctc / 12))}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              per month
            </div>
          </div>

        </div>



        <div className="mb-2 uppercase text-xs font-bold text-slate-500 tracking-wider">
          Salary Components
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 py-3 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
          <div className="col-span-6">Earnings</div>
          <div className="col-span-3 text-right">Monthly Amount</div>
          <div className="col-span-3 text-right">Annual Amount</div>
        </div>

        {/* Dynamic Earnings */}
        {renderedEarnings}

        {/* Fixed Allowance Row */}
        <div className="grid grid-cols-12 gap-4 py-4 border-b border-slate-100 items-center">
          <div className="col-span-6">
            <div className="font-medium text-slate-800">
              Fixed Allowance
            </div>
            <div className="text-[11px] text-slate-500">
              Fixed amount
            </div>
          </div>
          <div className="col-span-3 text-right font-mono text-slate-700">
            ₹ {formatMoney(fixedAllowanceMonthly)}
          </div>
          <div className="col-span-3 text-right font-mono text-slate-700">
            ₹ {formatMoney(fixedAllowanceAnnual)}
          </div>
        </div>

        {/* Total */}
        <div className="grid grid-cols-12 gap-4 py-4 items-center">
          <div className="col-span-6 font-bold text-slate-800">
            Cost to Company
          </div>
          <div className="col-span-3 text-right font-bold font-mono text-slate-800">
            ₹ {formatMoney(Math.round(ctc / 12))}
          </div>
          <div className="col-span-3 text-right font-bold font-mono text-slate-800">
            ₹ {formatMoney(ctc)}
          </div>
        </div>
      </div>


    </div>
  );
};

export default React.memo(Step2SalaryReview);
