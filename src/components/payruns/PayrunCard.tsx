import React from 'react';
import { Info } from 'lucide-react';
import Card from '../common/Card';
import CustomButton from '../common/CustomButton';

interface PayrunCardProps {
    title: string;
    status: string;
    netPay: number;
    paymentDate: string;
    employeeCount: number;
    onViewDetails: () => void;
    overdueDays?: number;
    statusVariant?: 'draft' | 'blue' | 'green';
    onCreatepayrun?: () => void;
}

const PayrunCard: React.FC<PayrunCardProps> = ({
    title,
    status,
    netPay,
    paymentDate,
    employeeCount,
    onViewDetails,
    overdueDays,
    statusVariant = 'draft',
}) => {
    const isApproved = status.toUpperCase() === 'APPROVED';

    return (
        <Card className="hover:shadow-md transition-shadow border border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h3 className="text-[15px] text-slate-800 font-bold">{title}</h3>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide ${statusVariant === 'blue'
                            ? 'bg-[#EBF1FA] text-[#4285F4]'
                            : statusVariant === 'green' || isApproved
                                ? 'bg-[#E6F4EA] text-[#1E8E3E]'
                                : 'bg-slate-100 text-slate-500'
                        }`}>
                        {status}
                    </span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                <div className="grid grid-cols-3 gap-12 w-full md:w-3/4">
                    <div>
                        <div className="text-[11px] font-medium text-slate-500 mb-1">Employees' Net Pay</div>
                        <div className="text-[15px] font-bold text-slate-800">₹{netPay.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    <div>
                        <div className="text-[11px] font-medium text-slate-500 mb-1">Payment Date</div>
                        <div className="text-[15px] text-slate-800 font-medium tracking-tight">{paymentDate}</div>
                    </div>
                    <div>
                        <div className="text-[11px] font-medium text-slate-500 mb-1">No. of Employees</div>
                        <div className="text-[15px] text-slate-800 font-medium">{employeeCount}</div>
                    </div>
                </div>

                <div className="md:absolute md:right-0 md:-top-6 flex items-center gap-2">
                    {isApproved ? (
                        <CustomButton
                            onClick={onViewDetails}
                            className="bg-[#4285F4] hover:bg-blue-600 text-[13px] px-5 py-2 font-medium shadow-none text-white border-none transition-colors"
                        >
                            View Details & Pay
                        </CustomButton>
                    ) : (
                        <>
                            
                            <CustomButton
                                onClick={onViewDetails}
                                className="bg-[#4285F4] hover:bg-blue-600 text-[13px] px-5 py-2 font-medium shadow-none text-white border-none transition-colors"
                            >
                                View Details
                            </CustomButton>
                        </>
                    )}
                </div>
            </div>

            {isApproved && (
                <div className="mt-6 flex items-start gap-2 text-slate-500 text-[12px] bg-slate-50/50 p-3 rounded-lg border border-slate-100/50">
                    <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Pay your employees on {paymentDate}. Record it here once you have made the payment.</span>
                </div>
            )}

            {overdueDays !== undefined && overdueDays > 0 && !isApproved && (
                <div className="mt-6 flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Info className="w-3.5 h-3.5" />
                    <span>This payment is overdue by {overdueDays} day(s).</span>
                </div>
            )}
        </Card>
    );
};

export default React.memo(PayrunCard);
