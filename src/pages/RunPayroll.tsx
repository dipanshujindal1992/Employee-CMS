import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constant/routes';

import Card from '../components/common/Card';
import { ArrowLeft, ArrowRight, Save, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import CustomButton from '../components/common/CustomButton';
import CustomInput from '../components/common/CustomInput';

const MOCK_EMPLOYEES = [
    { id: 'EMP-001', name: 'Manish Kumar', role: 'Software Engineer', baseSalary: 80000 },
    { id: 'EMP-002', name: 'Sarah Wilson', role: 'Product Manager', baseSalary: 120000 },
    { id: 'EMP-003', name: 'James Anderson', role: 'Designer', baseSalary: 75000 },
    { id: 'EMP-004', name: 'Robert Fox', role: 'DevOps Engineer', baseSalary: 95000 },
    { id: 'EMP-005', name: 'Emily Chen', role: 'HR Specialist', baseSalary: 60000 },
];

type PayRunEmployee = {
    employeeId: string;
    name: string;
    role: string;
    baseSalary: number;
    earnings: number;
    deductions: number;
    lopDays: number;
    netPay: number;
};

const RunPayroll: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [period, setPeriod] = useState(
        new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    );
    const [payDay, setPayDay] = useState(
        new Date().toISOString().split('T')[0]
    );

    const [employees, setEmployees] = useState<PayRunEmployee[]>([]);

    // Step 1 → Initialize payroll
    const handleStep1Submit = useCallback(() => {
        const initialEmployees = MOCK_EMPLOYEES.map(emp => {
            const earnings = emp.baseSalary;
            const deductions = emp.baseSalary / 21;

            return {
                employeeId: emp.id,
                name: emp.name,
                role: emp.role,
                baseSalary: emp.baseSalary,
                earnings,
                deductions,
                lopDays: 0,
                netPay: earnings - deductions
            };
        });

        setEmployees(initialEmployees);
        setStep(2);
    }, []);

    // Handle LOP change
    const handleLopChange = useCallback((empId: string, days: string) => {
        const lop = parseInt(days) || 0;

        setEmployees(prev =>
            prev.map(emp => {
                if (emp.employeeId !== empId) return emp;

                const perDaySalary = emp.baseSalary / 30;
                const lopAmount = perDaySalary * lop;
                const fixedDeduction = emp.baseSalary / 21;

                const totalDeduction = fixedDeduction + lopAmount;
                const netPay = emp.earnings - totalDeduction;

                return {
                    ...emp,
                    lopDays: lop,
                    deductions: totalDeduction,
                    netPay
                };
            })
        );
    }, []);

    // Totals (Step 2 & 3)
    const totalDeductions = useMemo(
        () => employees.reduce((sum, emp) => sum + emp.deductions, 0),
        [employees]
    );

    const totalNetPay = useMemo(
        () => employees.reduce((sum, emp) => sum + emp.netPay, 0),
        [employees]
    );

    const totalCost = totalNetPay;

    const handleFinish = useCallback(() => {
        navigate(ROUTES.PAY_RUNS);
    }, [navigate]);

    const handleGoToStep1 = useCallback(() => setStep(1), []);
    const handleGoToStep2 = useCallback(() => setStep(2), []);
    const handleGoToStep3 = useCallback(() => setStep(3), []);
    const handlePeriodChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setPeriod(e.target.value), []);
    const handlePayDayChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setPayDay(e.target.value), []);

    const handleInputLopChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const empId = e.target.dataset.empid;
        if (empId) {
            handleLopChange(empId, e.target.value);
        }
    }, [handleLopChange]);

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <CustomButton
                        variant="outline"
                        className="p-2 rounded-full"
                        onClick={handleFinish}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </CustomButton>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Run Payroll</h1>
                        <p className="text-slate-500 text-sm">Step {step} of 3</p>
                    </div>
                </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-center mb-8">
                {[1, 2, 3].map((s, i) => (
                    <React.Fragment key={s}>
                        <div className={`flex items-center gap-2 ${step >= s ? 'text-primary' : 'text-slate-400'}`}>
                            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold border-current">
                                {s}
                            </div>
                            <span className="font-medium">
                                {s === 1 ? 'Setup' : s === 2 ? 'Employees' : 'Review'}
                            </span>
                        </div>
                        {i < 2 && (
                            <div className={`w-20 h-0.5 mx-4 ${step > s ? 'bg-primary' : 'bg-slate-200'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* STEP 1 */}
            {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="max-w-xl mx-auto space-y-6 p-8">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Pay Period</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <CustomInput
                                    value={period}
                                    onChange={handlePeriodChange}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Pay Date</label>
                            <CustomInput
                                type="date"
                                value={payDay}
                                onChange={handlePayDayChange}
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <CustomButton
                                onClick={handleStep1Submit}
                                rightIcon={<ArrowRight className="w-4 h-4" />}
                            >
                                Next: Select Employees
                            </CustomButton>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Employee Summary
                            </h3>
                            <div className="text-sm text-slate-500">
                                Total Employees: <span className="font-bold text-slate-800">{employees.length}</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3">Employee</th>
                                        <th className="px-4 py-3 text-center">LOP Days</th>
                                        <th className="px-4 py-3 text-right">Gross Pay</th>
                                        <th className="px-4 py-3 text-right">Deductions</th>
                                        <th className="px-4 py-3 text-right">Net Pay</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {employees?.map(emp => (
                                        <tr key={emp.employeeId}>
                                            <td className="px-4 py-3 font-medium text-slate-800">
                                                <div>{emp.name}</div>
                                                <div className="text-xs text-slate-500">{emp.role}</div>
                                            </td>
                                            <td className="px-4 py-3 text-center w-32">
                                                <CustomInput
                                                    type="number"
                                                    min="0"
                                                    max="31"
                                                    className="w-16 mx-auto text-center h-8"
                                                    value={emp.lopDays}
                                                    data-empid={emp.employeeId}
                                                    onChange={handleInputLopChange}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right">₹{emp.earnings.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right text-red-500">
                                                -₹{emp.deductions.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold">
                                                ₹{emp.netPay.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pt-8 flex justify-between">
                            <CustomButton variant="outline" onClick={handleGoToStep1}>Back</CustomButton>
                            <div className="flex gap-4 items-center">
                                <div className="text-right">
                                    <div className="text-xs text-slate-500 uppercase">Total Payroll Cost</div>
                                    <div className="text-xl font-bold text-primary">₹{totalCost.toLocaleString()}</div>
                                </div>
                                <CustomButton onClick={handleGoToStep3} rightIcon={<ArrowRight className="w-4 h-4" />}>
                                    Next: Review
                                </CustomButton>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20">
                        <div className="text-center py-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Ready to submit?</h2>
                            <p className="text-slate-600 max-w-lg mx-auto">
                                You are about to approve payroll for <span className="font-bold">{period}</span> with a total payout of <span className="font-bold text-primary">₹{totalNetPay.toLocaleString()}</span>.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                                <div className="text-slate-500 text-sm uppercase mb-1">Total Earnings</div>
                                <div className="text-2xl font-bold">₹{(totalNetPay + totalDeductions).toLocaleString()}</div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                                <div className="text-slate-500 text-sm uppercase mb-1">Total Deductions</div>
                                <div className="text-2xl font-bold text-red-500">₹{totalDeductions.toLocaleString()}</div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border text-center ring-2 ring-primary/20">
                                <div className="text-slate-500 text-sm uppercase mb-1">Total Net Pay</div>
                                <div className="text-2xl font-bold text-primary">₹{totalNetPay.toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-between max-w-4xl mx-auto">
                            <CustomButton variant="outline" onClick={handleGoToStep2}>Back</CustomButton>
                            <CustomButton onClick={handleFinish} className="px-8" leftIcon={<Save className="w-4 h-4" />}>
                                Approve & Finish
                            </CustomButton>
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};

export default React.memo(RunPayroll);