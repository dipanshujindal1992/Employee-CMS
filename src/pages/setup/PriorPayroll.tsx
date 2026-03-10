import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { ArrowLeft, Save, History } from 'lucide-react';
import Card from '../../components/common/Card';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { ROUTES } from '../../constant/routes';

 const PriorPayroll: React.FC = () => {
    const navigate = useNavigate();

 const handleSave = useCallback(() => {
    const saved = localStorage.getItem('payroll_setup_steps');
    const completed = saved ? JSON.parse(saved) : {};
    completed[7] = true;
    localStorage.setItem('payroll_setup_steps', JSON.stringify(completed));
    navigate(ROUTES.DASHBOARD);
}, [navigate]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <CustomButton variant="ghost" className="p-0 hover:bg-transparent" onClick={() => navigate(ROUTES.DASHBOARD)}>
                    <ArrowLeft className="w-6 h-6 text-slate-400 hover:text-slate-700 transition-colors" />
                </CustomButton>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Prior Payroll Data</h1>
                    <p className="text-slate-500 text-sm mt-1">Enter your organisation's payroll details for previous months of the current financial year.</p>
                </div>
            </div>

            <Card className="p-8">
                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100 mb-8">
                    <History className="w-5 h-5 text-orange-500 mt-1" />
                    <div>
                        <h3 className="text-sm font-semibold text-orange-900">Why is this required?</h3>
                        <p className="text-xs text-orange-700 mt-1">This information is necessary to calculate accurate income tax projections and generate Form 16 for your employees.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomInput label="Financial Year" value="2023-24" disabled />
                        <CustomInput label="Previous Payroll Provider" placeholder="e.g. Excel, Tally, etc." />
                    </div>

                    <div className="p-12 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <History className="w-6 h-6 text-slate-300" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-700">No prior payroll data added</h3>
                        <p className="text-xs text-slate-400 mt-1">Start by adding employee-wise salary details for past months.</p>
                        <CustomButton variant="secondary" size="sm" className="mt-4">Import Data via Excel</CustomButton>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 mt-8">
                    <CustomButton variant="secondary" onClick={() => navigate(ROUTES.DASHBOARD)}>Cancel</CustomButton>
                    <CustomButton variant="primary" onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>Save and Finish</CustomButton>
                </div>
            </Card>
        </div>
    );
};
export default React.memo(PriorPayroll)