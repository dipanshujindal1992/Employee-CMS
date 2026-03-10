import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constant/routes';

import Card from '../components/common/Card';

import { ChevronLeft, Save } from 'lucide-react';
import Swal from 'sweetalert2';
import CustomButton from '../components/common/CustomButton';
import CustomInput from '../components/common/CustomInput';
import CustomSelectbox from '../components/common/CustomSelectbox';
import CustomTextArea from '../components/common/CustomTextArea';

export type ApprovalType = 'Reimbursement' | 'POI' | 'SalaryRevision';

export interface ApprovalRequest {
    id: string;
    type: ApprovalType;
    employeeId: string;
    employeeName: string;
    date: string;
    title: string;
    description: string;
    amount?: number;
    status: 'Pending' | 'Approved' | 'Rejected';
    documents?: string[];
}

const SubmitRequest: React.FC = () => {
    const navigate = useNavigate();

    // State for form data
    const [formData, setFormData] = useState<Omit<ApprovalRequest, 'id' | 'employeeId' | 'date' | 'status' | 'documents'>>({
        type: 'Reimbursement',
        employeeName: '',
        title: '',
        description: '',
        amount: undefined,
    });

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.employeeName || !formData.title) {
            Swal.fire('Error', 'Please fill in all required fields', 'error');
            return;
        }


        Swal.fire({
            title: 'Submitted!',
            text: 'Request has been submitted for approval.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            navigate(ROUTES.APPROVALS);
        });
    }, [formData, navigate]);

    const handleBack = useCallback(() => {
        navigate(ROUTES.APPROVALS);
    }, [navigate]);

    const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, type: e.target.value as ApprovalType }));
    }, []);

    const handleEmployeeNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, employeeName: e.target.value }));
    }, []);

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, title: e.target.value }));
    }, []);

    const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, description: e.target.value }));
    }, []);

    const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, amount: e.target.value ? parseFloat(e.target.value) : undefined }));
    }, []);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <CustomButton variant="outline" onClick={handleBack} className="p-2">
                    <ChevronLeft className="w-5 h-5" />
                </CustomButton>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Submit New Request</h1>
                    <p className="text-slate-500 text-sm">Create a new record for approval.</p>
                </div>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Request Type</label>
                        <CustomSelectbox
                            className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary"
                            value={formData.type}
                            onChange={handleTypeChange}
                        >
                            <option value="Reimbursement">Reimbursement Claim</option>
                            <option value="POI">Proof of Investment (POI)</option>
                            <option value="SalaryRevision">Salary Revision</option>
                        </CustomSelectbox>
                    </div>

                    <CustomInput
                        label="Employee Name"
                        placeholder="e.g. John Doe"
                        value={formData.employeeName}
                        onChange={handleEmployeeNameChange}
                        required
                    />

                    <CustomInput
                        label="Title / Subject"
                        placeholder="e.g. Travel Expenses / LIC Premium"
                        value={formData.title}
                        onChange={handleTitleChange}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <CustomTextArea
                            className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary min-h-[100px]"
                            placeholder="Provide details about this request..."
                            value={formData.description}
                            onChange={handleDescriptionChange}
                        />
                    </div>

                    {(formData.type === 'Reimbursement' || formData.type === 'SalaryRevision') && (
                        <CustomInput
                            label="Amount (₹)"
                            type="number"
                            placeholder="0.00"
                            value={formData.amount?.toString() || ''}
                            onChange={handleAmountChange}
                        />
                    )}

                    <div className="flex justify-end pt-4">
                        <CustomButton type="submit" leftIcon={<Save className="w-4 h-4" />}>
                            Submit Request
                        </CustomButton>
                    </div>
                </form>
            </Card>
        </div>
    );
};
export default React.memo(SubmitRequest);