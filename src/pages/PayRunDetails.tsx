import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../constant/routes';
import { ChevronLeft, MoreHorizontal, Search, Plus, Trash2 } from 'lucide-react';
import CustomButton from '../components/common/CustomButton';
import Card from '../components/common/Card';
import CustomInput from '../components/common/CustomInput';
import CustomSelectbox from '../components/common/CustomSelectbox';
import Modal from '../components/common/Modal';
import CustomPagination from '../components/common/CustomPagination';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { payrunDetailsListRequest, payrunRemoveEmployeeRequest, payrunEmployeeAddRequest, payrunEmployeeListRequest, payrunDeleteRequest, createPayrunRequest } from '../redux/services/payrunSlice';
import type { PayrunDetailItem } from '../redux/services/payrunSlice';
import { toast } from 'react-toastify';
import { formatDateGB } from '../utils/commonFunctions';
import PayRunEmployeeDetailsDrawer from '../components/payruns/PayRunEmployeeDetailsDrawer';

const PayRunDetails: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();

    // Redux State
    const employeeList = useSelector((state: RootState) => state?.payrun?.payrunEmployeeList);
    const payrunDetailsList = useSelector((state: RootState) => state.payrun?.payrunDetailsList);
    const detailsTotalPages = useSelector((state: RootState) => state?.payrun?.detailsTotalPages);
    const detailsCurrentPage = useSelector((state: RootState) => state?.payrun?.detailsCurrentPage);
    const detailsTotalCount = useSelector((state: RootState) => state?.payrun?.detailsTotalCount);
    const successMessage = useSelector((state: RootState) => state?.payrun?.successMessage);
    const errorMessage = useSelector((state: RootState) => state?.payrun?.error);
    const payrunList = useSelector((state: RootState) => state?.payrun?.payrunList);

    // Local State
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const headerDropdownRef = useRef<HTMLDivElement>(null);

    // Modal State
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [selectedEmployeeForModal, setSelectedEmployeeForModal] = useState('');
    const [payoutAmount, setPayoutAmount] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedEmployeeForPanel, setSelectedEmployeeForPanel] = useState<any | null>(null);

    const location = useLocation();
    const { isOneTime, componentName } = location.state || { isOneTime: false, componentName: '', date: '' };

    const pageTitle = isOneTime
        ? `One-time Payout (${componentName || 'Commission'}) (POI Based)`
        : 'Regular Payroll';

    const currentPayrun = payrunList?.find(run => run._id === id);
    const currentStatus = currentPayrun?.status || 'DRAFT';
    const isApproved = currentStatus.toUpperCase() === 'APPROVED';

    // Fetch Initial Data
    useEffect(() => {
        if (id&& isOneTime ) {
            dispatch(payrunEmployeeListRequest({ page: 1, limit: 100 }));
            dispatch(payrunDetailsListRequest({ page: 1, limit: 6, payRunId: id }));
        }
    }, [dispatch, id,isOneTime]);

    // Handle Toast Notifications
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
    }, [successMessage, errorMessage, isLoading, navigate, dispatch]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenMenuId(null);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Handle Page Change
    const handlePageChange = useCallback((page: number) => {
        if (id) dispatch(payrunDetailsListRequest({ page, limit: 6, payRunId: id }));
    }, [dispatch, id]);

    // Add Employee Logic
    const handleAddEmployeeSave = useCallback(() => {
        if (!selectedEmployeeForModal || !payoutAmount || !id) return;

        if (payrunDetailsList?.some((emp: PayrunDetailItem) => emp.employeeId?._id === selectedEmployeeForModal)) {
            toast.warn("Employee already added");
            return;
        }

        dispatch(payrunEmployeeAddRequest({
            payRunId: id,
            type: isOneTime ? "oneTime" : "regular",
            employeeId: selectedEmployeeForModal,
            netPay: Number(payoutAmount)
        }));

        setTimeout(() => {
            dispatch(payrunDetailsListRequest({ page: 1, limit: 6, payRunId: id }));
        }, 500);

        setIsEmployeeModalOpen(false);
        setSelectedEmployeeForModal('');
        setPayoutAmount('');
    }, [selectedEmployeeForModal, payoutAmount, payrunDetailsList, dispatch, id]);

    const handleRemoveEmployee = useCallback((e: React.MouseEvent, recordId: string) => {
        e.stopPropagation();
        setOpenMenuId(null);
        setEmployeeToDelete(recordId);
        setIsDeleteModalOpen(true);
    }, []);

    const handleRemoveEmployeeItem = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const id = e.currentTarget.dataset.id;
        if (id) {
            handleRemoveEmployee(e, id);
        }
    }, [handleRemoveEmployee]);

    const handleStopPropagation = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const handleBack = useCallback(() => {
        navigate(ROUTES.PAY_RUNS);
    }, [navigate]);

    const handleToggleHeaderMenu = useCallback(() => {
        setIsHeaderMenuOpen(prev => !prev);
    }, []);

    const handleSubmitAndApprove = useCallback(() => {
        if (id) {
            setIsLoading(true);
            dispatch(createPayrunRequest({ type: isOneTime ? "extra" : "regular", payRunId: id }));
        }
    }, [dispatch, id, isOneTime]);

    const handleDeletePayrun = useCallback(() => {
        setIsHeaderMenuOpen(false);
        if (id) {
            setIsLoading(true);
            dispatch(payrunDeleteRequest(id as any));
        }
    }, [dispatch, id]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleOpenEmployeeModal = useCallback(() => {
        setIsEmployeeModalOpen(true);
    }, []);

    const handleCloseEmployeeModal = useCallback(() => {
        setIsEmployeeModalOpen(false);
    }, []);

    const handleSelectedEmployeeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedEmployeeForModal(e.target.value);
    }, []);

    const handlePayoutAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPayoutAmount(e.target.value);
    }, []);

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

    const handleToggleMenuId = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const rowId = e.currentTarget.dataset.id;
        if (rowId) {
            setOpenMenuId(prev => prev === rowId ? null : rowId);
        }
    }, []);

    const handleViewEmployeeDetails = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setOpenMenuId(null);
        const employeeId = e.currentTarget.dataset.empid;
        if (employeeId) {
            navigate(`/employees/edit/${employeeId}`);
        }
    }, [navigate]);

    const handleRowClick = useCallback((employee: any) => {
        setSelectedEmployeeForPanel(employee);
        setIsDrawerOpen(true);
    }, []);

    const handleDrawerClose = useCallback(() => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedEmployeeForPanel(null), 300);
    }, []);

    // Close header dropdown on outside click
    useEffect(() => {
        const handleClickOutsideHeader = (event: MouseEvent) => {
            if (headerDropdownRef.current && !headerDropdownRef.current.contains(event.target as Node)) {
                setIsHeaderMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutsideHeader);
        return () => document.removeEventListener('mousedown', handleClickOutsideHeader);
    }, []);

    const employeeOptions = useMemo(() => {
        return (employeeList?.map((emp) => ({
            label: emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Unknown Employee',
            value: emp._id,
        })) || []);
    }, [employeeList]);

    const filteredPayrunDetailsList = useMemo(() => {
        let list = payrunDetailsList || [];

        // Inject static employee for testing regular payrun
        if (!isOneTime) {
            const staticEmployee = {
                _id: 'static_test_employee_1',
                payRunId: 'dummy_payrun_id',
                employeeId: {
                    _id: 'emp_123',
                    firstName: 'Dipanshu',
                    lastName: 'Jindal',
                    employeeId: 'TDSL01',
                    step1: true,
                    step2: true,
                    step3: true,
                    step4: true
                },
                grosPay: 41667.00,
                deduction: 0,
                netPay: 41667.00
            };
            // check if already exists to avoid duplication if list actually has items
            if (!list.some((e: any) => e._id === 'static_test_employee_1')) {
                list = [staticEmployee, ...list];
            }
        }

        if (!searchQuery.trim()) return list;
        const lowerQuery = searchQuery.toLowerCase();
        return list.filter((emp: any) => {
            const fullName = `${emp.employeeId?.firstName || ''} ${emp.employeeId?.lastName || ''}`.toLowerCase();
            return fullName.includes(lowerQuery);
        });
    }, [payrunDetailsList, searchQuery, isOneTime]);

    const totals = useMemo(() => {
        let gross = 0;
        let deductions = 0;
        let net = 0;
        if (payrunDetailsList && payrunDetailsList.length > 0) {
            payrunDetailsList.forEach((emp: any) => {
                gross += (emp.grosPay || 0);
                deductions += (emp.deduction || 0);
                net += (emp.netPay || 0);
            });
        }
        return { gross, deductions, net };
    }, [payrunDetailsList]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-32 relative overflow-x-hidden min-h-[calc(100vh-100px)]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                    <CustomButton
                        variant="none"
                        onClick={handleBack}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-[#4285F4] transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </CustomButton>
                    <h1 className="text-xl font-medium text-slate-800 flex items-center gap-3">
                        {pageTitle}
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide ${isApproved
                            ? 'bg-[#E6F4EA] text-[#1E8E3E]'
                            : 'bg-slate-100 text-slate-500'
                            }`}>
                            {currentStatus}
                        </span>
                    </h1>
                </div>

                <div className="flex items-center gap-3">


                    {!isApproved && (
                        <CustomButton
                            variant="primary"
                            onClick={handleSubmitAndApprove}
                            disabled={isLoading}
                            className="px-4 py-2 h-9 bg-[#4285F4] hover:bg-blue-600 text-white font-medium text-[13px] border-none shadow-sm"
                        >
                            {isLoading ? 'Approving...' : 'Submit and Approve'}
                        </CustomButton>
                    )}

                    <div className="relative" ref={headerDropdownRef}>
                        <CustomButton
                            variant="none"
                            onClick={handleToggleHeaderMenu}
                            className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm ml-1"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </CustomButton>
                        <AnimatePresence>
                            {isHeaderMenuOpen && (
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
                                        onClick={handleDeletePayrun}
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


            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Payroll Cost Card */}
                <Card className="md:col-span-4 bg-slate-50 border-none shadow-sm">
                    <div className="flex items-center gap-2 text-[13px] text-slate-600 mb-6">
                        Period: <span className="font-semibold text-slate-800">{payrunDetailsList && payrunDetailsList.length > 0 && payrunDetailsList[0]?.createdAt
                            ? formatDateGB(payrunDetailsList[0].createdAt)
                            : '--'}</span>
                    </div>

                    <div className="flex items-center justify-between mt-4 gap-8">
                        <div>
                            <div className="text-2xl font-medium text-slate-800">₹{totals.net.toFixed(2)}</div>
                            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-1">PAYROLL COST</div>
                        </div>
                        <div>
                            <div className="text-2xl font-medium text-slate-800">₹{totals.net.toFixed(2)}</div>
                            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-1">TOTAL NET PAY</div>
                        </div>
                    </div>
                </Card>

                {/* Pay Day Card */}
                <Card className="md:col-span-3 flex flex-col items-center justify-center border border-slate-200 shadow-sm py-6">
                    <div className="text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">PAY DAY</div>
                    <div className="text-1xl font-light text-slate-800 mb-1">
                        {payrunDetailsList && payrunDetailsList.length > 0 && payrunDetailsList[0]?.createdAt
                            ? formatDateGB(payrunDetailsList[0].createdAt)
                            : '--'}
                    </div>
                    <div className="mt-4 text-sm font-medium text-slate-700 pt-3 border-t border-slate-100 w-full text-center">
                        {payrunDetailsList?.length || 0} Employees
                    </div>
                </Card>



            </div>

            {/* Secondary Tabs */}
            <div className="space-y-4">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <span className="text-[15px] font-medium text-slate-800">All Employees</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1 block" />
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <CustomInput
                                placeholder="Search Employee"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="pl-9 h-9 text-[13px] w-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        {isOneTime && (
                            <CustomButton
                                variant="outline"
                                onClick={handleOpenEmployeeModal}
                                className="h-9 px-3 gap-2 text-slate-600 border-slate-300 font-medium"
                            >
                                <Plus className="w-4 h-4" /> Add Employee
                            </CustomButton>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto md:overflow-visible border-t border-slate-200 pt-2 w-full">
                    <table className="w-full text-left text-[11px] uppercase tracking-wider text-slate-500 whitespace-nowrap min-w-[800px]">
                        <thead>
                            <tr className="border-b border-slate-100">

                                <th className="py-4 px-4 font-semibold">EMPLOYEE NAME</th>
                                {isOneTime ? (
                                    <>
                                        <th className="py-4 px-4 font-semibold">TAX PREFERENCE</th>
                                        <th className="py-4 px-4 font-semibold text-right">GROSS PAY</th>
                                        <th className="py-4 px-4 font-semibold text-right">TAXES</th>
                                        <th className="py-4 px-4 font-semibold text-right">NET PAY</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="py-4 px-4 font-semibold">PAID DAYS</th>
                                        <th className="py-4 px-4 font-semibold text-right">GROSS PAY</th>
                                        <th className="py-4 px-4 font-semibold text-right">DEDUCTIONS</th>
                                        <th className="py-4 px-4 font-semibold text-right">TAXES</th>
                                        <th className="py-4 px-4 font-semibold text-right">BENEFITS</th>
                                        <th className="py-4 px-4 font-semibold text-right">REIMBURSEMENTS</th>
                                        <th className="py-4 px-4 font-semibold text-right">NET PAY</th>
                                    </>
                                )}
                                <th className="py-4 px-4"></th>
                            </tr>
                        </thead>
                        <tbody className="normal-case text-[13px] text-slate-700 tracking-normal border-b border-slate-100">
                            {(!filteredPayrunDetailsList || filteredPayrunDetailsList.length === 0) ? (
                                <tr>
                                    <td colSpan={10} className="w-full text-center py-12 text-slate-500 bg-slate-50">
                                        No employees found for this pay run.
                                    </td>
                                </tr>
                            ) : (
                                filteredPayrunDetailsList?.map((emp: any) => (
                                    <tr
                                        key={emp._id}
                                        className="hover:bg-slate-50 group cursor-pointer"
                                        onClick={() => handleRowClick(emp)}
                                    >

                                        <td className="py-4 px-4 font-medium text-slate-800">
                                            {emp.employeeId?.firstName} {emp.employeeId?.lastName}
                                        </td>
                                        {isOneTime ? (
                                            <>
                                                <td className="py-4 px-4">Deduct Tax in subsequent payroll</td>
                                                <td className="py-4 px-4 text-right">₹{(emp.grosPay || emp.netPay || 0).toFixed(2)}</td>
                                                <td className="py-4 px-4 text-right">₹0.00</td>
                                                <td className="py-4 px-4 text-right flex items-center justify-end gap-2 pr-12">
                                                    ₹{(emp.netPay || 0).toFixed(2)}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-4 px-4">31</td>
                                                <td className="py-4 px-4 text-right">₹{(emp.grosPay || 0).toFixed(2)}</td>
                                                <td className="py-4 px-4 text-right">₹{(emp.deduction || 0).toFixed(2)}</td>
                                                <td className="py-4 px-4 text-right">₹0.00</td>
                                                <td className="py-4 px-4 text-right">₹0.00</td>
                                                <td className="py-4 px-4 text-right">₹0.00</td>
                                                <td className="py-4 px-4 text-right flex items-center justify-end gap-2 pr-12">
                                                    ₹{(emp.netPay || 0).toFixed(2)}
                                                </td>
                                            </>
                                        )}

                                        {/* Action Menu Trigger */}
                                        <td className={`relative w-12 px-4 py-4 text-center ${openMenuId === emp._id ? 'z-50' : ''}`}>
                                            <div className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center ${openMenuId === emp._id ? 'opacity-100 z-50' : 'opacity-0 group-hover:opacity-100 z-10'}`}>
                                                <CustomButton
                                                    variant="none"
                                                    data-id={emp._id}
                                                    onClick={handleToggleMenuId}
                                                    className="p-1 px-2 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors bg-white shadow-sm border border-slate-200"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </CustomButton>

                                                {openMenuId === emp._id && (
                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-1.5 z-[60] flex flex-col gap-1" onClick={handleStopPropagation}>
                                                        <CustomButton
                                                            variant="none"
                                                            data-id={emp._id}
                                                            className="w-full flex items-center px-3 py-2 text-[13px] text-[#4285F4] hover:bg-blue-50 rounded-lg transition-colors text-left font-medium"
                                                            onClick={handleRemoveEmployeeItem}
                                                        >
                                                            Remove Employee
                                                        </CustomButton>
                                                        <CustomButton
                                                            variant="none"
                                                            data-empid={emp.employeeId?._id}
                                                            className="w-full flex items-center px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left"
                                                            onClick={handleViewEmployeeDetails}
                                                        >
                                                            View Employee Details
                                                        </CustomButton>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="py-4 px-4"></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {payrunDetailsList && payrunDetailsList.length > 0 && (
                    <div className="pt-2">
                        <CustomPagination
                            currentPage={detailsCurrentPage}
                            totalPages={detailsTotalPages}
                            totalItems={detailsTotalCount}
                            itemsPerPage={6}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
            {/* Modals from AddOneTimePayout */}
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
                            disabled={!selectedEmployeeForModal || !payoutAmount}
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
                            value={selectedEmployeeForModal}
                            onChange={handleSelectedEmployeeChange}
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
                            onChange={handlePayoutAmountChange}
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

            {/* Employee Details Side Panel */}
            <PayRunEmployeeDetailsDrawer
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                employee={selectedEmployeeForPanel}
                isOneTime={isOneTime}
                componentName={componentName}
            />
        </div>
    );
};

export default React.memo(PayRunDetails);
