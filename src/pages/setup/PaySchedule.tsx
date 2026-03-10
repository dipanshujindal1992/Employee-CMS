import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { ArrowLeft, Info, Pencil, Loader2 } from 'lucide-react';
import Card from '../../components/common/Card';
import clsx from 'clsx';
import CustomInput from '../../components/common/CustomInput';
import CustomRadioInput from '../../components/common/CustomRadioInput';
import CustomSearchableSelect from '../../components/common/CustomSearchableSelect';
import CustomButton from '../../components/common/CustomButton';
import { ROUTES } from '../../constant/routes';
import {
    payScheduleGetRequest,
    payScheduleSetRequest,
    payScheduleResetState
} from '../../redux/services/payScheduleSlice';
import type { RootState } from '../../redux/store';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const PaySchedule: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [workDays, setWorkDays] = useState(['MON', 'TUE', 'WED', 'THU', 'FRI']);
    const [calcBasis, setCalcBasis] = useState('Actual');
    const [daysPerMonth, setDaysPerMonth] = useState('');
    const [payDay, setPayDay] = useState('Last');
    const [specificPayDay, setSpecificPayDay] = useState('1');
    const [firstPayrollDate, setFirstPayrollDate] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isEditing, setIsEditing] = useState(true);

    const { paySchedule, isLoading, isSaving, successMessage, error: reduxError } = useSelector(
        (state: RootState) => state?.paySchedule || {} as any
    );

    useEffect(() => {
        dispatch(payScheduleGetRequest());
        return () => {
            dispatch(payScheduleResetState());
        };
    }, [dispatch]);

    useEffect(() => {
        if (paySchedule) {
            if (paySchedule.workWeek?.length > 0) {
                setWorkDays(paySchedule.workWeek?.map((d: string) => d.toUpperCase()));
            }
            if (paySchedule.salaryCalculationType) {
                setCalcBasis(paySchedule.salaryCalculationType === 'fixedDays' ? 'Fixed' : 'Actual');
            }
            if (paySchedule.organizationWorkingDays) {
                setDaysPerMonth(paySchedule.organizationWorkingDays.toString());
            }
            if (paySchedule.payType === 'specificDay' || paySchedule.payType === 'specific') {
                setPayDay('Specific');
                setSpecificPayDay(paySchedule.specificPayDay?.toString() || '1');
            } else {
                setPayDay('Last');
            }
            if (paySchedule.firstPayrollPayDate) {
                setFirstPayrollDate(paySchedule.firstPayrollPayDate.split('T')[0]);
            }
            setIsEditing(false);
        }
    }, [paySchedule]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            const saved = localStorage.getItem('payroll_setup_steps');
            const completed = saved ? JSON.parse(saved) : {};
            completed[3] = true;
            localStorage.setItem('payroll_setup_steps', JSON.stringify(completed));
            setIsEditing(false);
            dispatch(payScheduleResetState());
            // Re-fetch payload to ensure both APIs are handled on save as requested
            dispatch(payScheduleGetRequest());
        }
        if (reduxError) {
            toast.error(reduxError);
            setErrors({ global: reduxError });
            dispatch(payScheduleResetState());
        }
    }, [successMessage, reduxError, dispatch]);

    const toggleDay = useCallback((day: string) => {
        setWorkDays(prev => {
            const newDays = prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day];
            if (newDays.length > 0) setErrors(e => ({ ...e, workDays: '' }));
            return newDays;
        });
    }, []);

    const handleToggleDay = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const day = e.currentTarget.dataset.day;
        if (day) toggleDay(day);
    }, [toggleDay]);

    const handleCalcBasisChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCalcBasis(e.target.value);
        if (e.target.value === 'Actual') setErrors(e => ({ ...e, daysPerMonth: '' }));
    }, []);

    const handlePayDayChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPayDay(e.target.value);
        if (e.target.value === 'Last') setErrors(e => ({ ...e, specificPayDay: '' }));
    }, []);

    const handleSpecificPayDayChange = useCallback((val: string | number) => {
        setSpecificPayDay(val as string);
        if (val) setErrors(e => ({ ...e, specificPayDay: '' }));
    }, []);

    const handleFirstPayrollDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstPayrollDate(e.target.value);
        if (e.target.value) setErrors(errs => ({ ...errs, firstPayrollDate: '' }));
    }, []);

    const handleEditClick = useCallback(() => {
        setIsEditing(true);
    }, []);

    const validate = useCallback(() => {
        const newErrors: Record<string, string> = {};
        if (workDays.length === 0) newErrors.workDays = "Please select at least one work day.";
        if (calcBasis === 'Fixed' && !daysPerMonth) newErrors.daysPerMonth = "Please select organisation working days.";
        if (payDay === 'Specific' && !specificPayDay) newErrors.specificPayDay = "Please select a pay day.";
        if (!firstPayrollDate) newErrors.firstPayrollDate = "Please select the first payroll date.";
        return newErrors;
    }, [workDays, calcBasis, daysPerMonth, payDay, specificPayDay, firstPayrollDate]);

    const handleSave = useCallback((e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const validationErrs = validate();
        if (Object.keys(validationErrs).length > 0) {
            setErrors(validationErrs);
            return;
        }
        setErrors({});

        const payload = {
            workWeek: workDays?.map(d => d.toLowerCase()),
            salaryCalculationType: calcBasis === 'Fixed' ? 'fixedDays' : 'actualDays',
            organizationWorkingDays: calcBasis === 'Fixed' ? Number(daysPerMonth) : undefined,
            payType: payDay === 'Specific' ? 'specificDay' : 'lastDay',
            specificPayDay: payDay === 'Specific' ? Number(specificPayDay) : undefined,
            firstPayrollMonth: firstPayrollDate.substring(0, 7), // YYYY-MM
            firstPayrollPayDate: new Date(firstPayrollDate).toISOString(),
        };

        dispatch(payScheduleSetRequest(payload));
    }, [
        validate,
        workDays,
        calcBasis,
        daysPerMonth,
        payDay,
        specificPayDay,
        firstPayrollDate,
        dispatch
    ]);

    const formattedPayDayText = useMemo(() => {
        if (payDay === 'Last') return 'Last day of every month';
        return `${specificPayDay} of every month`;
    }, [payDay, specificPayDay]);

    const upcomingPayrolls = useMemo(() => {
        if (!firstPayrollDate) return [];
        const date = new Date(firstPayrollDate);
        const firstPeriod = `${date.toLocaleString('default', { month: 'long' })}-${date.getFullYear()}`;

        const d1 = new Date(firstPayrollDate);
        const y1 = d1.getFullYear();
        const pd1 = `${d1.getDate().toString().padStart(2, '0')}/${(d1.getMonth() + 1).toString().padStart(2, '0')}/${y1}`;

        const d2 = new Date(firstPayrollDate);
        d2.setMonth(d2.getMonth() + 1);
        const m2 = d2.toLocaleString('default', { month: 'long' });
        const y2 = d2.getFullYear();

        let nextPayDay = d2.getDate();
        if (payDay === 'Last') {
            const lastDay = new Date(y2, d2.getMonth() + 1, 0);
            nextPayDay = lastDay.getDate();
        } else {
            nextPayDay = parseInt(specificPayDay) || 1;
        }

        const nextDateObj = new Date(y2, d2.getMonth(), nextPayDay);
        // adjust for weekends
        if (nextDateObj.getDay() === 0) nextDateObj.setDate(nextDateObj.getDate() - 2); // Sunday to Friday
        if (nextDateObj.getDay() === 6) nextDateObj.setDate(nextDateObj.getDate() - 1); // Saturday to Friday

        const pd2 = `${nextDateObj.getDate().toString().padStart(2, '0')}/${(nextDateObj.getMonth() + 1).toString().padStart(2, '0')}/${y2}`;

        return [
            { period: firstPeriod, date: pd1 },
            { period: `${m2}-${y2}`, date: pd2 },
        ];
    }, [firstPayrollDate, payDay, specificPayDay]);

    const handleBack = useCallback(() => {
        navigate(ROUTES.DASHBOARD);
    }, [navigate]);
    const handleDaysPerMonthChange = useCallback(
        (val: string | number) => {
            setDaysPerMonth(val as string);
            if (val) setErrors(e => ({ ...e, daysPerMonth: '' }));
        },
        []
    );
    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <CustomButton variant="ghost" className="p-0 hover:bg-transparent" onClick={handleBack}>
                    <ArrowLeft className="w-6 h-6 text-slate-400 hover:text-slate-700 transition-colors" />
                </CustomButton>
                <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Pay Schedule</h1>
            </div>

            <Card className="p-8">
                {isLoading && !paySchedule ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : isEditing ? (
                    <form className="space-y-10" onSubmit={handleSave}>
                        {/* Work Week */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                                Select your work week<span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-slate-400">The days worked in a calendar week</p>
                            <div className="flex border border-slate-200 rounded-md overflow-hidden w-fit">
                                {DAYS?.map((day) => (
                                    <CustomButton
                                        key={day}
                                        data-day={day}
                                        type="button"
                                        variant='none'
                                        onClick={handleToggleDay}
                                        className={clsx(
                                            "px-5 py-2 text-xs font-medium border-r border-slate-200 last:border-0 transition-colors",
                                            workDays.includes(day) ? "bg-blue-50 text-blue-600" : "bg-white text-slate-500 hover:bg-slate-50"
                                        )}
                                    >
                                        {day}
                                    </CustomButton>
                                ))}
                            </div>
                            {errors.workDays && <p className="text-red-500 text-xs mt-1">{errors.workDays}</p>}
                        </div>

                        {/* Salary Calculation */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                                Calculate monthly salary based on<span className="text-red-500">*</span>
                                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            </label>
                            <div className="space-y-4">
                                <CustomRadioInput
                                    name="calcBasis"
                                    value="Actual"
                                    checked={calcBasis === 'Actual'}
                                    onChange={handleCalcBasisChange}
                                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    label="Actual days in a month"
                                />
                                <div className="flex items-center gap-3">
                                    <CustomRadioInput
                                        name="calcBasis"
                                        value="Fixed"
                                        checked={calcBasis === 'Fixed'}
                                        onChange={handleCalcBasisChange}
                                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    />
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-slate-600 font-medium group-hover:text-slate-800">Organisation working days -</span>
                                        <div className="w-[100px]">
                                            <CustomSearchableSelect
                                                disabled={calcBasis !== 'Fixed'}
                                                value={daysPerMonth}
                                                onChange={handleDaysPerMonthChange}
                                                options={[...Array(12)].map((_, i) => ({ value: (i + 20).toString(), label: (i + 20).toString() }))}
                                                placeholder="Select"
                                                error={errors.daysPerMonth}
                                                hideClear={true}
                                            />
                                        </div>
                                        <span className="text-sm text-slate-600 font-medium group-hover:text-slate-800">days per month</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pay On */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                                Pay on<span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-4">
                                <CustomRadioInput
                                    name="payDay"
                                    value="Last"
                                    checked={payDay === 'Last'}
                                    onChange={handlePayDayChange}
                                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    label="the last working day of every month"
                                />
                                <div className="flex items-center gap-3">
                                    <CustomRadioInput
                                        name="payDay"
                                        value="Specific"
                                        checked={payDay === 'Specific'}
                                        onChange={handlePayDayChange}
                                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    />
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-slate-600 font-medium group-hover:text-slate-800">day</span>
                                        <div className="w-[100px]">
                                            <CustomSearchableSelect
                                                disabled={payDay !== 'Specific'}
                                                value={specificPayDay}
                                                onChange={handleSpecificPayDayChange}
                                                options={[...Array(31)].map((_, i) => ({ value: (i + 1).toString(), label: (i + 1).toString() }))}
                                                placeholder="1"
                                                error={errors.specificPayDay}
                                                hideClear={true}
                                            />
                                        </div>
                                        <span className="text-sm text-slate-600 font-medium group-hover:text-slate-800">of every month</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-lg">
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                <span className="font-bold">Note:</span> When payday falls on a non-working day or a holiday, employees will get paid on the previous working day.
                            </p>
                        </div>

                        {/* First Payroll From */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                                Start your first payroll from<span className="text-red-500">*</span>
                            </label>
                            <div className="max-w-xs relative">
                                <CustomInput
                                    type="date"
                                    value={firstPayrollDate}
                                    onChange={handleFirstPayrollDateChange}
                                    error={errors.firstPayrollDate}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                                />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <CustomButton disabled={isSaving} variant="primary" type="submit" className="px-8 bg-[#1e87f0] hover:bg-blue-600 text-white border-none h-11">
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    {isSaving ? "Saving..." : "Save"}
                                </CustomButton>
                                {errors.global && <p className="text-red-500 text-xs mt-2">{errors.global}</p>}
                            </div>
                            <span className="text-[11px] text-red-500 font-medium">All fields are mandatory</span>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-8">
                        {/* Note Alert */}
                        <div className="bg-[#fff9e6] border border-[#ffeb99] p-4 text-sm text-slate-800 flex items-center gap-3 rounded-md">
                            <span className="text-xl">💡</span>
                            <p><span className="font-semibold">Note:</span> Pay Schedule cannot be edited once you process the first pay run.</p>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                            <h2 className="text-lg font-semibold text-slate-800">This Organisation's payroll runs on this schedule.</h2>
                            <CustomButton variant="none" onClick={handleEditClick} className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-slate-500 transition-colors">
                                <Pencil className="w-3.5 h-3.5" />
                            </CustomButton>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="grid grid-cols-[160px_1fr] gap-4">
                                    <span className="text-sm font-medium text-slate-500">Pay Frequency</span>
                                    <span className="text-sm text-slate-800">Every month</span>
                                </div>
                                <div className="grid grid-cols-[160px_1fr] gap-4">
                                    <span className="text-sm font-medium text-slate-500">Working Days</span>
                                    <span className="text-sm text-slate-800">
                                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
                                            .filter(d => workDays.includes(d))
                                            .map(d => d.charAt(0) + d.slice(1).toLowerCase())
                                            .join(', ')}
                                    </span>
                                </div>
                                <div className="grid grid-cols-[160px_1fr] gap-4">
                                    <span className="text-sm font-medium text-slate-500">Pay Day</span>
                                    <span className="text-sm text-slate-800">{formattedPayDayText}</span>
                                </div>
                                <div className="grid grid-cols-[160px_1fr] gap-4">
                                    <span className="text-sm font-medium text-slate-500">First Pay Period</span>
                                    <span className="text-sm text-slate-800">
                                        {firstPayrollDate ? (
                                            (() => {
                                                const d = new Date(firstPayrollDate);
                                                return `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`
                                            })()
                                        ) : '-'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-[160px_1fr] gap-4">
                                    <span className="text-sm font-medium text-slate-500">First Pay Date</span>
                                    <span className="text-sm text-slate-800">
                                        {firstPayrollDate ? (
                                            (() => {
                                                const d = new Date(firstPayrollDate);
                                                return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
                                            })()
                                        ) : '-'}
                                    </span>
                                </div>
                            </div>

                            <div className="border-l border-slate-200 pl-8">
                                <h3 className="text-base font-semibold text-slate-800 mb-6">Upcoming Payrolls</h3>
                                <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[5px] before:w-[2px] before:bg-slate-100">
                                    {upcomingPayrolls?.map((pr: { period: string; date: string }, idx: number) => (
                                        <div key={idx} className="relative pl-6">
                                            <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
                                            <p className="text-sm font-semibold text-slate-800">{pr.period}</p>
                                            <p className="text-[13px] text-slate-500 mt-1">Pay Date : {pr.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
export default React.memo(PaySchedule)