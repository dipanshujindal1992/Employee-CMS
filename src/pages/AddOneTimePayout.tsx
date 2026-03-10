import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, Search, Users, MinusCircle, Trash2 } from 'lucide-react';
import { ROUTES } from '../constant/routes';
import CustomButton from '../components/common/CustomButton';
import CustomInput from '../components/common/CustomInput';
import CustomSelectbox from '../components/common/CustomSelectbox';
import Modal from '../components/common/Modal';
import CustomPagination from '../components/common/CustomPagination';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { formatDateGB } from '../utils/commonFunctions';
import { payrunDeleteRequest, payrunDetailsListRequest, payrunEmployeeAddRequest, payrunEmployeeListRequest, payrunRemoveEmployeeRequest } from '../redux/services/payrunSlice';
import type { PayrunDetailItem, PayrunEmployee } from '../redux/services/payrunSlice';
import { toast } from 'react-toastify';




const AddOneTimePayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { componentName, date, id } = location.state || {
        componentName: 'Bonus',
        date: new Date().toISOString().split('T')[0],
        id: null
    };
    // Modal State
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [payoutAmount, setPayoutAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Table & Drawer State
    // const [selectedDrawerEmployee, setSelectedDrawerEmployee] = useState<PayrunDetailItem | null>(null);
    const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);

    // Deletion Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const employeeList = useSelector((state: RootState) => state?.payrun?.payrunEmployeeList);
    const successMessage = useSelector((state: RootState) => state?.payrun?.successMessage);
    const errorMessage = useSelector((state: RootState) => state?.payrun?.error);
    const payrunDetailsList = useSelector((state: RootState) => state.payrun?.payrunDetailsList);

    // Pagination state
    const detailsTotalPages = useSelector((state: RootState) => state?.payrun?.detailsTotalPages);
    const detailsCurrentPage = useSelector((state: RootState) => state?.payrun?.detailsCurrentPage);
    const detailsTotalCount = useSelector((state: RootState) => state?.payrun?.detailsTotalCount);

    // Format date from YYYY-MM-DD to DD/MM/YYYY
    const formattedDate = formatDateGB(date) || "-"
    useEffect(() => {
        dispatch(payrunEmployeeListRequest({ page: 1, limit: 100 }));
        dispatch(payrunDetailsListRequest({ page: 1, limit: 10, payRunId: id }));
    }, [dispatch, id]);
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            if (isLoading) {
                navigate(ROUTES.PAY_RUNS);
            }
            dispatch({ type: 'payrun/payrunResetState' });
        }
        if (errorMessage) {
            toast.error(errorMessage);
            if (isLoading) {
                setIsLoading(false);
            }
            dispatch({ type: 'payrun/payrunResetState' });
        }
    }, [successMessage, errorMessage, isLoading, navigate, dispatch])

    // Click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsMoreDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        dispatch(payrunDetailsListRequest({ page, limit: 10, payRunId: id }));
    }, [dispatch, id]);

    const handleAddEmployeeSave = useCallback(() => {
        if (!selectedEmployee || !payoutAmount) return;

        // Prevent duplicates in Redux list
        if (payrunDetailsList?.some((emp: PayrunDetailItem) => emp.employeeId?._id === selectedEmployee)) {
            toast.warn("Employee already added");
            setIsEmployeeModalOpen(false);
            return;
        }

        // Validate complete profile steps
        const selectedEmpDetails = employeeList?.find((emp: PayrunEmployee) => emp._id === selectedEmployee);
        if (selectedEmpDetails) {
            const { step1, step2, step3, step4 } = selectedEmpDetails;
            if (!step1 || !step2 || !step3 || !step4) {
                toast.error("User details are incomplete.");
                return;
            }
        }

        dispatch(payrunEmployeeAddRequest({
            payRunId: id,
            type: "oneTime",
            employeeId: selectedEmployee,
            netPay: Number(payoutAmount)
        }));

        // Fetch updated list after adding since we rely strictly on API
        setTimeout(() => {
            dispatch(payrunDetailsListRequest({ page: 1, limit: 10, payRunId: id }));
        }, 500);

        setIsEmployeeModalOpen(false);
        setSelectedEmployee('');
        setPayoutAmount('');


    }, [selectedEmployee, payoutAmount, payrunDetailsList, employeeList, dispatch, id, navigate]);

    const handleRemoveEmployee = useCallback((e: React.MouseEvent, recordId: string) => {
        e.stopPropagation();
        setEmployeeToDelete(recordId);
        setIsDeleteModalOpen(true);
    }, []);

    const handleBack = useCallback(() => {
        navigate(ROUTES.PAY_RUNS);
    }, [navigate]);

    const handleOpenEmployeeModal = useCallback(() => {
        setIsEmployeeModalOpen(true);
    }, []);

    const handleCloseEmployeeModal = useCallback(() => {
        setIsEmployeeModalOpen(false);
    }, []);

    const handleToggleMoreDropdown = useCallback(() => {
        setIsMoreDropdownOpen(prev => !prev);
    }, []);

    const handleDeletePayRun = useCallback(() => {
        setIsMoreDropdownOpen(false);
        setIsLoading(true);
        if (id) {
            dispatch(payrunDeleteRequest(id));
        }
    }, [dispatch, id]);

    const handleCloseDeleteModal = useCallback(() => {
        setIsDeleteModalOpen(false);
        setEmployeeToDelete(null);
    }, []);

    const handleConfirmDeleteEmployee = useCallback(() => {
        if (employeeToDelete) {
            dispatch(payrunRemoveEmployeeRequest(employeeToDelete));
            setIsDeleteModalOpen(false);
            setEmployeeToDelete(null);
        }
    }, [dispatch, employeeToDelete]);

    const handleRemoveEmployeeBtnClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const recordId = e.currentTarget.dataset.id;
        if (recordId) {
            handleRemoveEmployee(e, recordId);
        }
    }, [handleRemoveEmployee]);

    const employeeOptions = useMemo(() => {
        return (
            employeeList?.map((emp) => ({
                label: emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Unknown Employee',
                value: emp._id,
            })) || []
        );
    }, [employeeList]);

    const filteredPayrunDetailsList = useMemo(() => {
        if (!payrunDetailsList) return [];
        if (!searchQuery.trim()) return payrunDetailsList;

        const lowerQuery = searchQuery.toLowerCase();
        return payrunDetailsList.filter((emp: any) => {
            const firstName = emp.employeeId?.firstName || '';
            const lastName = emp.employeeId?.lastName || '';
            const fullName = `${firstName} ${lastName}`.toLowerCase();
            return fullName.includes(lowerQuery);
        });
    }, [payrunDetailsList, searchQuery]);

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50/30 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 bg-white shadow-sm z-30">
                <div className="flex items-center gap-4">
                    <CustomButton
                        variant="none"
                        onClick={handleBack}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-[#4285F4] transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </CustomButton>
                    <div className="flex items-center gap-3">
                        <h1 className="text-[17px] font-semibold text-slate-800">
                            Add One Time Payout Details ({componentName})
                        </h1>
                        <div className="flex items-center gap-2 text-[13px] text-slate-500 bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
                            <span className="w-4 h-4 text-slate-400">📅</span> {/* Calendar placeholder */}
                            Pay Day : {formattedDate}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    {payrunDetailsList && payrunDetailsList.length > 0 && (
                        <>
                            <CustomButton
                                variant="primary"
                                onClick={handleOpenEmployeeModal}
                                className="bg-[#4285F4] hover:bg-blue-600 text-white font-medium border-none px-4 py-1.5 shadow-sm rounded-md text-[13px]"
                            >
                                Add Employee
                            </CustomButton>
                           
                        </>
                    )}
                    <div className="relative" ref={dropdownRef}>
                        <CustomButton
                            variant="none"
                            onClick={handleToggleMoreDropdown}
                            className="p-1 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors bg-white"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </CustomButton>
                        <AnimatePresence>
                            {isMoreDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-2 z-[60]"
                                >
                                    
                                    <CustomButton
                                        variant='none'
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"
                                        onClick={handleDeletePayRun}
                                    >
                                        <Trash2 className="w-4.5 h-4.5" />
                                        <span className="font-medium">Delete Pay Run</span>
                                    </CustomButton>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>

            {/* Toolbar */}
            <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center gap-3 z-10">
                <span className="text-[14px] text-slate-600 font-medium">Employees:</span>
                <div className="relative w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <CustomInput
                        placeholder="Search Employee"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 text-[13px] bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                {/* Table Header Wrapper to stay sticky */}
                <div className="border-b border-slate-200 bg-white">
                    <table className="w-full text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                        <thead>
                            <tr>
                                <th className="py-4 px-6 w-1/3">EMPLOYEE NAME</th>
                                <th className="py-4 px-6 text-center">GROSS PAY</th>
                                <th className="py-4 px-6 text-center">DEDUCTIONS</th>
                                <th className="py-4 px-6 text-right">NET PAY</th>
                            </tr>
                        </thead>
                    </table>
                </div>

                {(!filteredPayrunDetailsList || filteredPayrunDetailsList.length === 0) ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/30">
                        <div className="w-48 h-48 bg-blue-50/50 rounded-full flex items-center justify-center mb-6 relative">
                            {/* Illustration Placeholder matching Zoho style */}
                            <div className="w-32 h-32 bg-[#e8f0fe] rounded-2xl flex items-center justify-center rotate-3 relative z-10 shadow-sm border border-blue-100">
                                <Users className="w-16 h-16 text-[#4285F4]" />
                            </div>
                            <div className="w-32 h-32 bg-indigo-50 rounded-2xl absolute -rotate-6 z-0 border border-indigo-100/50"></div>
                        </div>

                        <h2 className="text-xl font-medium text-slate-800 mb-2">Add Employee details</h2>
                        <p className="text-[14px] text-slate-500 mb-8 text-center max-w-sm">
                            Click Add employees to add eligible employees to the payrun
                        </p>

                        <div className="flex items-center gap-4">
                            <CustomButton
                                variant="primary"
                                onClick={handleOpenEmployeeModal}
                                className="bg-[#4285F4] hover:bg-blue-600 text-white font-medium border-none px-6 py-2 shadow-sm rounded-md shadow-blue-500/20"
                            >
                                Add Employee
                            </CustomButton>
                            <CustomButton variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50 font-medium px-6 py-2 rounded-md">
                                Import Employees
                            </CustomButton>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto w-full">
                        <table className="w-full text-left">
                            <tbody className="text-[13px] text-slate-800">
                                {filteredPayrunDetailsList.map((emp: any) => (
                                    <tr
                                        key={emp._id}

                                        className="border-b border-slate-100/60 hover:bg-slate-50/80 cursor-pointer group transition-colors"
                                    >
                                        <td className="py-4 px-6 w-1/3 font-medium text-slate-700">
                                            {emp.employeeId?.firstName} {emp.employeeId?.lastName}
                                        </td>
                                        <td className="py-4 px-6 text-center">₹{(emp.netPay || 0).toFixed(2)}</td>
                                        <td className="py-4 px-6 text-center">₹{(emp.deduction || 0).toFixed(2)}</td>
                                        <td className="py-4 px-6 text-right relative pr-6">
                                            ₹{(emp.netPay || 0).toFixed(2)}

                                            {/* Hover Action */}
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                                <CustomButton
                                                    variant="none"
                                                    data-id={emp._id}
                                                    className="p-1 px-2 text-[#4285F4] hover:bg-blue-50 transition-colors bg-white rounded-md border border-slate-200 flex items-center gap-1.5 shadow-sm font-medium"
                                                    onClick={handleRemoveEmployeeBtnClick}
                                                >
                                                    <MinusCircle className="w-3.5 h-3.5" />
                                                    Remove Employee
                                                </CustomButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {payrunDetailsList && payrunDetailsList.length > 0 && (
                    <div className="px-6 bg-white border-t border-slate-100">
                        <CustomPagination
                            currentPage={detailsCurrentPage}
                            totalPages={detailsTotalPages}
                            totalItems={detailsTotalCount}
                            itemsPerPage={10}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {/* Add Employee Modal */}
            <Modal
                isOpen={isEmployeeModalOpen}
                onClose={handleCloseEmployeeModal}
                title="Add Employee"
                size="sm"
                footer={
                    <div className="flex gap-3 justify-start w-full px-2">
                        <CustomButton
                            variant="primary"
                            className="bg-[#4285F4] text-white hover:bg-blue-600 border-none px-6"
                            disabled={!selectedEmployee || !payoutAmount}
                            onClick={handleAddEmployeeSave}
                        >
                            Save
                        </CustomButton>
                        <CustomButton
                            variant="outline"
                            className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6"
                            onClick={handleCloseEmployeeModal}
                        >
                            Cancel
                        </CustomButton>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div className="space-y-1.5">
                        <CustomSelectbox
                            requiredIndicator
                            label="Employee"
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            options={employeeOptions}
                            placeholder="Search Employee"
                            className="w-full text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">

                        <CustomInput
                            label='Amount'
                            requiredIndicator
                            type="number"
                            value={payoutAmount}
                            onChange={(e) => setPayoutAmount(e.target.value)}
                            placeholder="Enter Amount"
                            className="w-full h-10 border-slate-200 text-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </Modal>

            {/* Remove Employee Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                title="Remove Employee"
                size="sm"
                footer={
                    <div className="flex gap-3 justify-start w-full px-2">
                        <CustomButton
                            variant="primary"
                            className="bg-red-500 text-white hover:bg-red-600 border-none px-6"
                            onClick={handleConfirmDeleteEmployee}
                        >
                            Remove
                        </CustomButton>
                        <CustomButton
                            variant="outline"
                            className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6"
                            onClick={handleCloseDeleteModal}
                        >
                            Cancel
                        </CustomButton>
                    </div>
                }
            >
                <div className="py-2 text-[14px] text-slate-600">
                    Are you sure you want to remove this employee from the current pay run?
                </div>
            </Modal>

            {/* Sliding Drawer for Employee Details */}

        </div >
    );
};

export default React.memo(AddOneTimePayout);
