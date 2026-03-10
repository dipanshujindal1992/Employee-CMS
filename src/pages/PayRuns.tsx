import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import { ChevronDown, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import RunPayrollTab from '../components/payruns/RunPayrollTab';
import PayrollHistoryTab from '../components/payruns/PayrollHistoryTab';
import Modal from '../components/common/Modal';
import CustomSelectbox from '../components/common/CustomSelectbox';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import CustomPagination from '../components/common/CustomPagination';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { fetchEarningTypeRequest } from '../redux/services/salaryComponentSlice';
import { payrunAddRequest, payrunListRequest } from '../redux/services/payrunSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constant/routes';
import { toast } from 'react-toastify';

// Types
type TabType = 'Run Payroll' | 'Payroll History';

// Mock Data for Payroll History
const initialHistoryRuns = [
    {
        id: '1',
        paymentDate: '30/04/2025',
        type: 'Regular Payroll',
        details: '01/04/2025 - 30/04/2025',
        status: 'Paid',
    }
];

const PayRuns: React.FC = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];
    // State
    const [historyRuns] = useState(initialHistoryRuns);
    const [activeTab, setActiveTab] = useState<TabType>('Run Payroll');
    const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);

    // Modal states
    const [isOneTimeModalOpen, setIsOneTimeModalOpen] = useState(false);
    const [isSubmittingOneTime, setIsSubmittingOneTime] = useState(false);
    const [oneTimeComponent, setOneTimeComponent] = useState('');
    const [oneTimeDate, setOneTimeDate] = useState('');
    const dispatch = useDispatch();
    const earningTypes = useSelector((state: RootState) => state?.salaryComponent?.earningTypes);
    const payrunListing = useSelector((state: RootState) => state?.payrun?.payrunList);
    const totalPages = useSelector((state: RootState) => state?.payrun?.totalPages);
    const currentPage = useSelector((state: RootState) => state?.payrun?.currentPage);
    const totalCount = useSelector((state: RootState) => state?.payrun?.totalCount);

    const payrunAddDetail = useSelector((state: RootState) => state?.payrun?.payrunAddDetail);
    const payrunError = useSelector((state: RootState) => state?.payrun?.error);
    const paySchedule = useSelector((state: RootState) => state?.payrun?.paySchedule);

    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        dispatch(fetchEarningTypeRequest())
    }, [dispatch]);

    // Handle outside click for dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsNewMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const earningOptions = useMemo(() => {
        return earningTypes
            ?.filter((type) => type?.name?.toLowerCase() !== "basic")
            .map((type) => ({
                label: type.name,
                value: type._id
            })) || [];
    }, [earningTypes]);

    useEffect(() => {
        dispatch(payrunListRequest({ page: 1, limit: 10 }))
    }, [dispatch]);

    const handlePageChange = useCallback((page: number) => {
        dispatch(payrunListRequest({ page, limit: 10 }));
    }, [dispatch]);

    useEffect(() => {
        if (payrunAddDetail && isSubmittingOneTime) {
            const selectedComponentObj = earningOptions.find(opt => opt.value === oneTimeComponent);
            const name = selectedComponentObj ? selectedComponentObj.label : 'Bonus';
            navigate(ROUTES.ADD_ONE_TIME_PAYOUT, {
                state: {
                    componentName: name,
                    date: oneTimeDate,
                    id: payrunAddDetail._id
                }
            });
            setIsOneTimeModalOpen(false);
            setIsSubmittingOneTime(false);
            setOneTimeComponent('');
            setOneTimeDate('');
        }
    }, [payrunAddDetail, isSubmittingOneTime, navigate, earningOptions, oneTimeComponent, oneTimeDate]);

    useEffect(() => {
        if (payrunError && isSubmittingOneTime) {
            toast.error(payrunError);
            setIsSubmittingOneTime(false);
        }
    }, [payrunError, isSubmittingOneTime]);

    const handleOneTimeSubmit = useCallback(() => {
        setIsSubmittingOneTime(true);
        dispatch(payrunAddRequest({
            type: "oneTime",
            date: oneTimeDate,
            earningId: oneTimeComponent
        }));
    }, [dispatch, oneTimeDate, oneTimeComponent]);

    const handleTabClick = useCallback((tab: TabType) => {
        setActiveTab(tab);
    }, []);

    const handleNewMenuToggle = useCallback(() => {
        setIsNewMenuOpen(prev => !prev);
    }, []);

    const openOneTimeModal = useCallback(() => {
        setIsNewMenuOpen(false);
        setIsOneTimeModalOpen(true);
    }, []);

    const closeOneTimeModal = useCallback(() => {
        setIsOneTimeModalOpen(false);
        setOneTimeComponent('');
        setOneTimeDate('');
    }, []);

    const onTabClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const tabName = e.currentTarget.dataset.tab;
        if (tabName) {
            handleTabClick(tabName as TabType);
        }
    }, [handleTabClick]);

    const handleOneTimeComponentChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setOneTimeComponent(e.target.value);
    }, []);

    const handleOneTimeDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setOneTimeDate(e.target.value);
    }, []);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header / Tabs / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 sm:pb-0 border-b border-slate-200">
                <div className="flex">
                    {(['Run Payroll'] as TabType[])?.map((tab) => (
                        <CustomButton
                            variant="none"
                            key={tab}
                            className={`pb-3 px-6 text-[15px] font-semibold transition-colors relative ${activeTab === tab ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800'
                                }`}
                            data-tab={tab}
                            onClick={onTabClick}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTab" className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#4285F4] rounded-t-full" />
                            )}
                        </CustomButton>
                    ))}
                </div>

                {/* New Dropdown */}
                <div className="relative pb-3" ref={dropdownRef}>
                    <CustomButton
                        variant="none"
                        onClick={handleNewMenuToggle}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 hover:bg-slate-100 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4 text-slate-500" />
                        New
                        <ChevronDown className="w-4 h-4 text-slate-500 ml-1" />
                    </CustomButton>

                    <AnimatePresence>
                        {isNewMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
                                className="absolute right-0 top-[40px] w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden"
                            >
                                <div className="py-2 text-left">
                                    <CustomButton
                                        variant='none'
                                        className="w-full text-left px-4 py-2.5 text-[13px] text-slate-700 hover:bg-[#4285F4]/10 hover:text-[#4285F4] transition-colors"
                                        onClick={openOneTimeModal}
                                    >
                                        One Time Payout
                                    </CustomButton>

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'Run Payroll' ? (
                        <>
                            <RunPayrollTab payrunList={payrunListing || []} paySchedule={paySchedule} />
                            {payrunListing && payrunListing.length > 0 && (
                                <CustomPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={totalCount}
                                    itemsPerPage={10}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    ) : (
                        <PayrollHistoryTab historyRuns={historyRuns} />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* One Time Payrun Modal */}
            <Modal
                isOpen={isOneTimeModalOpen}
                onClose={closeOneTimeModal}
                title="Create One Time Payrun"
                size="md"
                footer={
                    <div className="flex gap-3 justify-start w-full px-2">
                        <CustomButton
                            variant="primary"
                            className="bg-[#4285F4] text-white hover:bg-blue-600 border-none px-6"
                            onClick={handleOneTimeSubmit}
                            disabled={!oneTimeComponent || !oneTimeDate}
                        >
                            Save and Continue
                        </CustomButton>
                        <CustomButton variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6" onClick={closeOneTimeModal}>
                            Cancel
                        </CustomButton>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div className="space-y-1.5">

                        <CustomSelectbox
                            requiredIndicator
                            label="Select One Time Component"
                            value={oneTimeComponent}
                            onChange={handleOneTimeComponentChange}
                            options={earningOptions}
                            fullWidth
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-slate-700 flex items-center gap-1">
                            When would you like to pay? <span className="text-red-500">*</span>
                        </label>
                        <CustomInput
                            min={today}
                            type="date"
                            value={oneTimeDate}
                            onChange={handleOneTimeDateChange}
                            placeholder="dd/MM/yyyy"
                            className="w-full h-10 border-slate-200 text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default React.memo(PayRuns);