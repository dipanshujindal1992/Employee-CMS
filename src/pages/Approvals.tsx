import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Card from '../components/common/Card';
import {
    CheckSquare,
    FileText,
    IndianRupee,
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import CustomButton from '../components/common/CustomButton';

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

const initialRequests: ApprovalRequest[] = [
    {
        id: 'REQ-001',
        type: 'Reimbursement',
        employeeId: 'EMP-001',
        employeeName: 'John Doe',
        date: '2024-03-15T10:00:00Z',
        title: 'Client Meeting Travel',
        description: 'Taxi fare for meeting with ABC Corp',
        amount: 550,
        status: 'Pending'
    },
    {
        id: 'REQ-002',
        type: 'POI',
        employeeId: 'EMP-002',
        employeeName: 'Jane Smith',
        date: '2024-03-14T14:30:00Z',
        title: 'Section 80C Investment',
        description: 'Life Insurance Premium Receipt',
        status: 'Approved',
        documents: ['lic_receipt.pdf']
    }
];

const Approvals: React.FC = () => {
    const [requests, setRequests] = useState<ApprovalRequest[]>(initialRequests);
    const [activeTab, setActiveTab] = useState<ApprovalType>('Reimbursement');

    const handleAction = useCallback((id: string, action: 'Approve' | 'Reject') => {
        Swal.fire({
            title: `Are you sure you want to ${action.toLowerCase()}?`,
            text: action === 'Reject' ? "Please provide a reason (optional):" : "This action cannot be undone.",
            input: action === 'Reject' ? 'text' : undefined,
            icon: action === 'Approve' ? 'success' : 'warning',
            showCancelButton: true,
            confirmButtonColor: action === 'Approve' ? '#10b981' : '#ef4444',
            confirmButtonText: `Yes, ${action} it!`
        }).then((result) => {
            if (result.isConfirmed) {
                setRequests(prev => prev.map(req =>
                    req.id === id
                        ? { ...req, status: action === 'Approve' ? 'Approved' : 'Rejected' as any }
                        : req
                ));
                Swal.fire(
                    `${action}d!`,
                    `The request has been ${action.toLowerCase()}d.`,
                    'success'
                );
            }
        });
    }, []);

    const filteredRequests = useMemo(() => requests.filter(req => req.type === activeTab), [requests, activeTab]);

    const tabs = useMemo(() => [
        { id: 'Reimbursement' as ApprovalType, label: 'Reimbursements', icon: IndianRupee },
        { id: 'POI' as ApprovalType, label: 'Proof of Investments', icon: FileText },
        { id: 'SalaryRevision' as ApprovalType, label: 'Salary Revisions', icon: TrendingUp },
    ], []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                        <CheckSquare className="w-8 h-8 text-primary" />
                        Approvals
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage pending approvals for reimbursements, tax proofs, and salary revisions.</p>
                </div>
                <Link to="/approvals/new">
                    <CustomButton>+ New Request</CustomButton>
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto bg-white p-1 rounded-xl shadow-sm border border-slate-200 hide-scrollbar">
                {tabs.map((tab) => (
                    <CustomButton
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id
                            ? 'bg-primary text-white shadow-md'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </CustomButton>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="grid gap-4"
                    >
                        {filteredRequests.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200">
                                <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-slate-600">No requests found</h3>
                                <p className="text-slate-400">There are no {activeTab.toLowerCase()} requests to show.</p>
                            </div>
                        ) : (
                            filteredRequests.map((req) => (
                                <Card key={req.id} className="hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${req.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                    req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                                <span className="text-slate-400 text-sm flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(req.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800">{req.title}</h3>
                                            <p className="text-slate-600 text-sm mt-1">{req.description}</p>

                                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs">
                                                        {req.employeeName.charAt(0)}
                                                    </div>
                                                    {req.employeeName}
                                                </div>
                                                {req.amount && (
                                                    <div className="flex items-center gap-1 text-slate-700">
                                                        <IndianRupee className="w-3 h-3" />
                                                        {req.amount.toLocaleString()}
                                                    </div>
                                                )}
                                                {req.documents && (
                                                    <div className="flex items-center gap-1 text-blue-600 cursor-pointer hover:underline">
                                                        <FileText className="w-3 h-3" />
                                                        {req.documents.length} Attachment(s)
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {req.status === 'Pending' && (
                                            <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                                                <CustomButton
                                                    variant="outline"
                                                    className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                                    onClick={() => handleAction(req.id, 'Reject')}
                                                >
                                                    <XCircle className="w-4 h-4 mr-1" /> Reject
                                                </CustomButton>
                                                <CustomButton
                                                    className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                                                    onClick={() => handleAction(req.id, 'Approve')}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                                                </CustomButton>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
export default React.memo(Approvals);