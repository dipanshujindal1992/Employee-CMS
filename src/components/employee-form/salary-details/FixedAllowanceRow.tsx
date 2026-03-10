import React from "react";
import { Info } from "lucide-react";

interface FixedAllowanceRowProps {
    fixedAllowanceAmountMonthly: number;
    fixedAllowanceAmountAnnual: number;
}

const FixedAllowanceRow: React.FC<FixedAllowanceRowProps> = ({
    fixedAllowanceAmountMonthly,
    fixedAllowanceAmountAnnual,
}) => {
    return (
        <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center group relative z-10 border-b border-slate-100 pb-4">
            <div className="col-span-4 pr-4">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700">Fixed Allowance <Info className="w-3.5 h-3.5 inline text-slate-400 mb-0.5 ml-1" /></span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Monthly CTC - Sum of all other components</span>
                </div>
            </div>
            <div className="col-span-4 flex items-center gap-0">
                <div className="w-[200px] px-3 py-1.5 border border-slate-200 rounded text-[13px] bg-slate-50 flex items-center h-[34px] font-medium text-slate-600">
                    Fixed amount
                </div>
            </div>
            <div className="col-span-2 text-right">
                <div className="bg-slate-50/80 px-3 py-1.5 rounded text-sm text-slate-600 font-medium inline-block min-w-[80px] text-right border border-transparent">
                    {Math.round(fixedAllowanceAmountMonthly)}
                </div>
            </div>
            <div className="col-span-2 text-right">
                <div className="bg-slate-50/80 px-3 py-1.5 rounded text-sm text-slate-800 font-medium inline-block min-w-[80px] text-right border border-transparent">
                    {Math.round(fixedAllowanceAmountAnnual)}
                </div>
            </div>
        </div>
    );
};

export default React.memo(FixedAllowanceRow);
