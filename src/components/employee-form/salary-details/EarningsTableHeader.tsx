import React from "react";

const EarningsTableHeader: React.FC = () => {
    return (
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4">Salary Components</div>
            <div className="col-span-4">Calculation Type</div>
            <div className="col-span-2 text-right">Monthly Amount</div>
            <div className="col-span-2 text-right">Annual Amount</div>
        </div>
    );
};

export default React.memo(EarningsTableHeader);
