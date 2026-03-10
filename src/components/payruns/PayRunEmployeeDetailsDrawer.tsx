import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, ChevronDown, Plus, MinusCircle } from 'lucide-react';
import CustomButton from '../common/CustomButton';
import { motion, AnimatePresence } from 'framer-motion';
import CustomInput from '../common/CustomInput';

interface PayRunEmployeeDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    employee: any | null;
    isOneTime?: boolean;
    componentName?: string;
}

interface ExtraEarning {
    id: string;
    name: string;
    amount: string;
}

const EARNING_OPTIONS = [
    { id: 'bonus', name: 'Bonus' },
    { id: 'commission', name: 'Commission' },
    { id: 'leave_encashment', name: 'Leave Encashment' }
];

const PayRunEmployeeDetailsDrawer: React.FC<PayRunEmployeeDetailsDrawerProps> = ({
    isOpen,
    onClose,
    employee,
    isOneTime = false,
    componentName = ''
}) => {
    const [lopDays, setLopDays] = useState('0');
    const [showLopInput, setShowLopInput] = useState(false);
    const [showAddEarningMenu, setShowAddEarningMenu] = useState(false);
    const [extraEarnings, setExtraEarnings] = useState<ExtraEarning[]>([]);

    const earningMenuRef = useRef<HTMLDivElement>(null);

    const availableEarnings = useMemo(() => {
        return EARNING_OPTIONS?.filter(
            opt => !extraEarnings?.find(e => e.id === opt.id)
        ) || [];
    }, [extraEarnings]);

    const handleAddExtraEarning = useCallback((option: { id: string; name: string }) => {
        setExtraEarnings((prev) => [...prev, { id: option.id, name: option.name, amount: '0' }]);
        setShowAddEarningMenu(false);
    }, []);

    const handleRemoveExtraEarning = useCallback((id: string) => {
        setExtraEarnings((prev) => prev?.filter(e => e.id !== id) || []);
    }, []);

    const handleExtraEarningAmountChange = useCallback((id: string, value: string) => {
        setExtraEarnings((prev) => prev?.map(e => e.id === id ? { ...e, amount: value } : e) || []);
    }, []);

    // Close earning dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (earningMenuRef.current && !earningMenuRef.current.contains(event.target as Node)) {
                setShowAddEarningMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Placeholder Static Data for the UI as requested by user
    const defaultNetPay = employee?.netPay || 41667.00;
    const empName = employee?.employeeId?.firstName
        ? `${employee?.employeeId?.firstName} ${employee?.employeeId?.lastName || ''}`
        : 'Dipanshu Jindal';
    const empId = employee?.employeeId?.employeeId || 'TDSL01';
const handleOpenLopInput = useCallback(() => {
    setShowLopInput(true);
}, []);

const handleCloseLopInput = useCallback(() => {
    setShowLopInput(false);
    setLopDays('0');
}, []);

const toggleAddEarningMenu = useCallback(() => {
    setShowAddEarningMenu(prev => !prev);
}, []);

const handleCloseDrawer = useCallback(() => {
    onClose();
}, [onClose]);
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
                        onClick={handleCloseDrawer}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-[480px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
                            <div>
                                <h2 className="text-[17px] font-semibold text-slate-800">{empName}</h2>
                                <p className="text-[13px] text-slate-500 mt-0.5">Emp. ID: {empId}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-[12px] text-slate-500 font-medium">Net Pay</p>
                                    <p className="text-[18px] font-semibold text-slate-800">
                                        ₹{defaultNetPay.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <CustomButton
                                    variant="none"
                                    onClick={handleCloseDrawer}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </CustomButton>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto w-full pb-8">
                            <div className="pt-6 w-full">

                                {!isOneTime && (
                                    <div className="w-full px-6 mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[14px] text-slate-700">Payable Days</span>
                                            <span className="text-[14px] text-slate-800">31</span>
                                        </div>

                                        {!showLopInput ? (
                                            <div className="inline-flex items-center bg-[#f0f4ff] border border-[#d6e4ff] rounded-md transition-colors mt-2">
                                                <CustomButton
                                                    variant='none'
                                                    onClick={handleOpenLopInput}
                                                    className="text-[13px] text-[#4285F4] font-medium flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#e5edff] rounded-l-md transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" /> Add LOP
                                                </CustomButton>
                                                <div className="w-[1px] h-4 bg-[#d6e4ff]"></div>
                                                <CustomButton
                                                    onClick={handleOpenLopInput}
                                                    className="px-2 py-1.5 text-[#4285F4] hover:bg-[#e5edff] rounded-r-md transition-colors"
                                                >
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                </CustomButton>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between mb-4 mt-8">
                                                    <span className="text-[14px] text-slate-700">LOP Days</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex rounded-md shadow-sm">
                                                            <CustomInput
                                                                type="number"
                                                                value={lopDays}
                                                                onChange={(e) => setLopDays(e.target.value)}
                                                                className="w-14 h-8 px-2 text-center border border-slate-300 border-r-0 rounded-l-md text-[13px] focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] z-10"
                                                                min="0"
                                                                max="31"
                                                            />
                                                            <div className="flex items-center justify-center px-3 border border-slate-300 rounded-r-md bg-white text-[13px] text-slate-600">
                                                                Days
                                                            </div>
                                                        </div>
                                                        <CustomButton
                                                            variant='none'
                                                            onClick={handleCloseLopInput}
                                                            className="w-4 h-4 rounded-full bg-red-50 text-red-400 hover:text-red-500 flex items-center justify-center border border-red-100 hover:bg-red-100 transition-colors ml-1"
                                                        >
                                                            <X className="w-2.5 h-2.5" />
                                                        </CustomButton>
                                                    </div>
                                                </div>

                                                <div className="border-t border-dashed border-slate-300 w-full my-6"></div>

                                                <div className="flex items-center justify-between mb-5">
                                                    <span className="text-[14px] text-slate-800 font-medium tracking-tight">Actual Payable Days</span>
                                                    <span className="text-[14px] text-slate-800">{31 - Number(lopDays || 0)}</span>
                                                </div>

                                                <CustomButton variant='none' className="text-[13px] text-[#4285F4] font-medium flex items-center gap-1 hover:underline mt-4">
                                                    <Plus className="w-3.5 h-3.5" /> Adjust Past LOP
                                                </CustomButton>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Earnings Section */}
                                <div className="w-full">
                                    <div className="flex items-center justify-between px-6 p-3 border-y border-slate-100 bg-[#f8f9fa]">
                                        <span className="text-[11px] font-semibold text-[#1e8b50] uppercase tracking-wider">(+) EARNINGS</span>
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">AMOUNT</span>
                                    </div>

                                    <div className="px-6 py-4 space-y-4">
                                        {isOneTime ? (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[14px] text-slate-700">{componentName || 'Commission'}</span>
                                                <div className="w-32 relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[13px]">₹</span>
                                                    <CustomInput
                                                        type="number"
                                                        value={defaultNetPay}
                                                        className="w-full h-8 pl-7 pr-3 text-right bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[14px] text-slate-700">Basic</span>
                                                    <span className="text-[14px] font-medium text-slate-800">₹20,834.00</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[14px] text-slate-700">House Rent Allowance</span>
                                                    <span className="text-[14px] font-medium text-slate-800">₹10,417.00</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[14px] text-slate-700">Conveyance Allowance</span>
                                                    <span className="text-[14px] font-medium text-slate-800">₹1,600.00</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[14px] text-slate-700">Fixed Allowance</span>
                                                    <span className="text-[14px] font-medium text-slate-800">₹8,816.00</span>
                                                </div>

                                                {/* Dynamic Extra Earnings */}
                                                {extraEarnings?.map((earning) => (
                                                    <div key={earning.id} className="flex items-center justify-between mt-6">
                                                        <span className="text-[14px] text-slate-700">{earning.name}</span>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex rounded-md shadow-sm w-36 border border-slate-200">
                                                                <div className="flex items-center justify-center px-3 border-r border-slate-200 bg-[#f8f9fa] text-[13px] text-slate-500 rounded-l-md font-medium">
                                                                    ₹
                                                                </div>
                                                                <CustomInput
                                                                    type="number"
                                                                    value={earning.amount}
                                                                    onChange={(e) => handleExtraEarningAmountChange(earning.id, e.target.value)}
                                                                    className="w-full h-9 px-3 text-right bg-white rounded-r-md text-[13px] focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4]"
                                                                    min="0"
                                                                />
                                                            </div>
                                                            <CustomButton
                                                                variant='none'
                                                                onClick={() => handleRemoveExtraEarning(earning.id)}
                                                                className="w-5 h-5 rounded-full text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors shrink-0"
                                                                title="Remove"
                                                            >
                                                                <MinusCircle strokeWidth={1.5} className="w-[18px] h-[18px]" />
                                                            </CustomButton>
                                                        </div>
                                                    </div>
                                                ))}

                                                {availableEarnings.length > 0 && (
                                                    <div className="pt-5 relative" ref={earningMenuRef}>
                                                        <CustomButton
                                                            variant='none'
                                                            onClick={toggleAddEarningMenu}
                                                            className="text-[14px] text-[#4285F4] flex items-center hover:underline w-fit select-none"
                                                        >
                                                            <div className="w-5 h-5 rounded-full bg-[#f0f4ff] flex items-center justify-center mr-2">
                                                                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                                            </div>
                                                            Add Earning
                                                        </CustomButton>

                                                        {/* Add Earning Dropdown */}
                                                        <AnimatePresence>
                                                            {showAddEarningMenu && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -10 }}
                                                                    className="absolute left-0 mt-3 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-2"
                                                                >
                                                                    {availableEarnings?.map((opt) => (
                                                                        <CustomButton
                                                                            variant='none'
                                                                            key={opt.id}
                                                                            onClick={() => handleAddExtraEarning(opt)}
                                                                            className="w-full text-left px-4 py-2.5 text-[13px] text-slate-700 hover:bg-[#4285F4] hover:text-white transition-colors"
                                                                        >
                                                                            {opt.name}
                                                                        </CustomButton>
                                                                    ))}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Deductions Section */}
                                <div className="w-full mt-2">
                                    <div className="flex items-center justify-between px-6 py-3 border-y border-slate-100 bg-[#f8f9fa]">
                                        <span className="text-[11px] font-semibold text-[#d93025] uppercase tracking-wider">(-) DEDUCTIONS</span>
                                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">AMOUNT</span>
                                    </div>

                                    <div className="px-6 py-4 space-y-4">
                                        <div>
                                            <span className="text-[14px] text-slate-800">Taxes</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[14px] text-slate-700">Income Tax</span>
                                            <span className="text-[14px] font-medium text-slate-800">₹0.00</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Net Pay Readout */}
                                <div className="px-6 py-5 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between w-full mt-2">
                                    <span className="text-[14px] font-semibold text-slate-700 uppercase tracking-wider">NET PAY</span>
                                    <span className="text-[17px] font-semibold text-slate-800">
                                        ₹{defaultNetPay.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CustomButton
                                    variant="primary"
                                    className="bg-[#4285F4] hover:bg-blue-600 text-white px-6 py-2 h-9 border-none text-[13px] font-medium shadow-sm"
                                    onClick={handleCloseDrawer}
                                >
                                    Save
                                </CustomButton>
                                <CustomButton
                                    variant="outline"
                                    onClick={handleCloseDrawer}
                                    className="px-6 py-2 h-9 text-slate-700 border-slate-300 hover:bg-slate-50 text-[13px] font-medium"
                                >
                                    Cancel
                                </CustomButton>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#F59E0B]">
                                <span className="text-[12px] font-medium">Click Save to update Net Pay</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default React.memo(PayRunEmployeeDetailsDrawer);
