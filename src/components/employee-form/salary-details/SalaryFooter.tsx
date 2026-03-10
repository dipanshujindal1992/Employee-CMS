import React from "react";

interface SalaryFooterProps {
    ctc: number;
}

const SalaryFooter: React.FC<SalaryFooterProps> = ({ ctc }) => {
    return (
        <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-200 grid grid-cols-12 gap-4 items-center rounded-b">
            <div className="col-span-8 text-[15px] font-semibold text-slate-800">
                Cost to Company
            </div>
            <div className="col-span-2 text-right">
                <span className="text-[15px] font-bold text-slate-800">
                    ₹{Math.round(ctc / 12)}
                </span>
            </div>
            <div className="col-span-2 text-right">
                <span className="text-[15px] font-bold text-slate-800">
                    ₹{Math.round(ctc)}
                </span>
            </div>
        </div>
    );
};

export default React.memo(SalaryFooter);
