import React from "react";
import { Info } from "lucide-react";

interface NegativeBalanceBannerProps {
    fixedAllowanceAmountMonthly: number;
    fixedAllowanceAmountAnnual: number;
}

const NegativeBalanceBanner: React.FC<NegativeBalanceBannerProps> = ({
    fixedAllowanceAmountMonthly,
    fixedAllowanceAmountAnnual,
}) => {
    return (
        <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-100 rounded flex gap-3 text-red-600">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
            <div>
                <div className="text-sm font-bold text-slate-800">System Calculated Components' Total</div>
                <div className="text-sm mt-0.5 text-slate-600">Amount must be greater than zero. Adjust the CTC or any of the component's amount.</div>
                <div className="grid grid-cols-2 mt-4 max-w-xs">
                    <div className="text-sm font-bold text-red-500">{Math.round(fixedAllowanceAmountMonthly)}</div>
                    <div className="text-sm font-bold text-red-500 text-right">{Math.round(fixedAllowanceAmountAnnual)}</div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(NegativeBalanceBanner);
