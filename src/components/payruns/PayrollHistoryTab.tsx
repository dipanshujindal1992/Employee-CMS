import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constant/routes';
import Card from '../common/Card';
import { ChevronDown } from 'lucide-react';

interface HistoryRun {
    id: string;
    paymentDate: string;
    type: string;
    details: string;
    status: string;
}

interface PayrollHistoryTabProps {
    historyRuns: HistoryRun[];
}

const PayrollHistoryTab: React.FC<PayrollHistoryTabProps> = ({ historyRuns }) => {
    const navigate = useNavigate();

    const handleRowClick = useCallback((id: string) => {
        navigate(ROUTES.PAY_RUN_DETAILS.replace(":id", id));
    }, [navigate]);

    return (
        <div className="space-y-4 pt-2">
            {/* Payroll History Toolbar */}
            <div className="flex px-1">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-sm">
                    <span className="text-slate-500 font-normal">Payroll Type:</span> All
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
                </button>
            </div>

            {/* Payroll History Table */}
            {historyRuns.length === 0 ? (
                <Card className="py-20 text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
                    <h3 className="text-xl font-semibold text-slate-700">No Pay Runs Yet</h3>
                    <p className="text-slate-500 mt-2">No past payroll records found.</p>
                </Card>
            ) : (
                <div className="overflow-x-auto bg-white border-t border-slate-100">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                                <th className="py-4 px-6">PAYMENT DATE</th>
                                <th className="py-4 px-6">PAYROLL TYPE</th>
                                <th className="py-4 px-6">DETAILS</th>
                                <th className="py-4 px-6">PAYROLL STATUS</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px] text-slate-800">
                            {historyRuns?.map(run => (
                                <tr key={run.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => handleRowClick(run.id)}>
                                    <td className="py-5 px-6 font-medium text-slate-700">{run?.paymentDate}</td>
                                    <td className="py-5 px-6">{run?.type}</td>
                                    <td className="py-5 px-6 font-medium text-slate-600">{run?.details}</td>
                                    <td className="py-5 px-6">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${run?.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                                            run?.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                            {run?.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default React.memo(PayrollHistoryTab);
