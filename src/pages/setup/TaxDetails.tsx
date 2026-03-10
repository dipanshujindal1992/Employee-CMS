import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { ArrowLeft, Info, Loader2 } from 'lucide-react';
import Card from '../../components/common/Card';
import CustomInput from '../../components/common/CustomInput';
import CustomRadioInput from '../../components/common/CustomRadioInput';
import CustomSelectbox from '../../components/common/CustomSelectbox';
import CustomButton from '../../components/common/CustomButton';
import { ROUTES } from '../../constant/routes';
import { taxGetRequest, taxSetRequest, taxResetState } from '../../redux/services/taxSlice';
import type { RootState } from '../../redux/store';
import { getEmployeeListRequest } from '../../redux/services/employeeSlice';


const TaxDetails: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { tax, isLoading, successMessage, errorMessage } = useSelector((state: RootState) => state.tax);
    const getEmployeeList = useSelector((state: RootState) => state.employee.getEmployeeList);

    const [formData, setFormData] = useState({
        pan: '',
        tan: '',
        tdsCircle: '',
        aoCode: '',
        rangeCode: '',
        aoType: '',
        taxPaymentFrequency: 'Monthly',
        deductorType: 'Employee',
        deductorName: '',
        employeeId: '',
        deductorFatherName: '',
        deductorDesignation: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));

            setErrors(prev => {
                if (!prev[name]) return prev;
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        },
        []
    );
    const handleDeductorTypeChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;

            setFormData(prev => {
                if (value === "Employee") {
                    return {
                        ...prev,
                        deductorType: "Employee",
                        employeeId: "",
                        deductorName: "",
                        deductorDesignation: "",
                        deductorFatherName: ""
                    };
                } else {
                    return {
                        ...prev,
                        deductorType: "Non-Employee",
                        employeeId: "",
                        deductorName: "",
                        deductorDesignation: "",
                        deductorFatherName: ""
                    };
                }
            });

            // Clear related errors
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.employeeId;
                delete newErrors.deductorName;
                delete newErrors.deductorFatherName;
                delete newErrors.deductorDesignation;
                return newErrors;
            });
        },
        []
    );

    useEffect(() => {
        dispatch(taxGetRequest());
        dispatch(getEmployeeListRequest({}));
    }, [dispatch]);

    useEffect(() => {
        if (tax) {
            setFormData(prev => ({
                ...prev,
                pan: tax.pan || '',
                tan: tax.tan || '',
                tdsCircle: tax.tdsCircle || '',
                aoCode: tax.aoCode || '',
                rangeCode: tax.rangeCode || '',
                aoType: tax.aoType || '',
                taxPaymentFrequency: tax.taxPaymentFrequency || 'Monthly',
                deductorType:
                    tax.isEmployee !== undefined
                        ? (tax.isEmployee ? 'Employee' : 'Non-Employee')
                        : (tax.deductorType || 'Employee'),
                deductorName: tax.name || tax.deductorName || '',
                employeeId: tax.employeeId || '',
                deductorFatherName: tax.fatherName || tax.deductorFatherName || '',
                deductorDesignation: tax.designation || tax.deductorDesignation || ''
            }));
        } else {
            setFormData({
                pan: '',
                tan: '',
                tdsCircle: '',
                aoCode: '',
                rangeCode: '',
                aoType: '',
                taxPaymentFrequency: 'Monthly',
                deductorType: 'Employee',
                deductorName: '',
                employeeId: '',
                deductorFatherName: '',
                deductorDesignation: ''
            });
            setErrors({});
        }
    }, [tax]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(taxResetState());
            navigate(ROUTES.DASHBOARD);
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(taxResetState());
        }
    }, [successMessage, errorMessage, dispatch, navigate]);

    const employeeOptions = useMemo(() => {
        return [
            { label: "Select a Tax Deductor", value: "" },
            ...(getEmployeeList?.map((emp: any) => {
                const fullName =
                    emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`.trim();

                return {
                    label: fullName || "Unknown Employee",
                    value: emp._id,
                };
            }) || []),
        ];
    }, [getEmployeeList]);

    const selectedEmployee = useMemo(() => {
        if (!formData.employeeId) return null;

        return (
            getEmployeeList?.find(emp => emp._id === formData.employeeId) || null
        );
    }, [formData.employeeId, getEmployeeList]);


    useEffect(() => {
        if (formData.deductorType === "Employee" && selectedEmployee) {
            setFormData(prev => ({
                ...prev,
                deductorFatherName: selectedEmployee.fatherName || ""
            }));
        }
    }, [selectedEmployee, formData.deductorType]);

    const validate = useCallback(() => {
        const newErrors: Record<string, string> = {};
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const tanRegex = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;

        // PAN Validation
        if (!formData.pan.trim()) {
            newErrors.pan = 'PAN is required.';
        } else if (!panRegex.test(formData.pan.toUpperCase())) {
            newErrors.pan = 'Invalid PAN format (e.g., ABCDE1234F).';
        }

        // TAN Validation
        if (formData.tan && !tanRegex.test(formData.tan.toUpperCase())) {
            newErrors.tan = 'Invalid TAN format (e.g., ABCD12345E).';
        }

        // Deductor Type Validation
        const isEmployeeDeductorFilled = !!formData.employeeId || !!formData.deductorFatherName.trim();
        const isNonEmployeeDeductorFilled = !!formData.deductorName.trim() || !!formData.deductorFatherName.trim() || !!formData.deductorDesignation.trim();

        if (formData.deductorType === "Employee") {
            if (isEmployeeDeductorFilled) {
                if (!formData.employeeId) {
                    newErrors.employeeId = "Please select Deductor's Name.";
                }

                if (!formData.deductorFatherName.trim()) {
                    newErrors.deductorFatherName = "Father's Name is required.";
                }
            }
        } else {
            if (isNonEmployeeDeductorFilled) {
                if (!formData.deductorName.trim()) {
                    newErrors.deductorName = "Deductor's Name is required.";
                }

                if (!formData.deductorFatherName.trim()) {
                    newErrors.deductorFatherName = "Father's Name is required.";
                }

                if (!formData.deductorDesignation.trim()) {
                    newErrors.deductorDesignation = "Designation is required.";
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleBack = useCallback(() => {
        navigate(ROUTES.DASHBOARD);
    }, [navigate]);

    const handleEmployeeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, employeeId: value }));

        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.employeeId;
            return newErrors;
        });
    }, []);

    const handleSave = useCallback(
        (e?: React.FormEvent) => {
            if (e) e.preventDefault();
            if (!validate()) return;

            const isEmp = formData.deductorType === 'Employee';
            let deductorName = formData.deductorName;

            if (isEmp && selectedEmployee) {
                deductorName =
                    selectedEmployee.name ||
                    `${selectedEmployee.firstName || ''} ${selectedEmployee.lastName || ''}`.trim();
            }

            const payload: any = {
                pan: formData.pan,
                tan: formData.tan,
                tds: "10%",
                isEmployee: isEmp,
                employeeId: deductorName?.trim() ? (isEmp ? formData.employeeId : null) : null,
                name: deductorName,
                fatherName: formData.deductorFatherName,
                designation: !isEmp ? formData.deductorDesignation : undefined
            };

            dispatch(taxSetRequest(payload));
        },
        [validate, formData, dispatch, selectedEmployee]
    );
    const isEmployeeDeductorFilled = !!formData.employeeId || !!formData.deductorFatherName.trim();
    const isNonEmployeeDeductorFilled = !!formData.deductorName.trim() || !!formData.deductorFatherName.trim() || !!formData.deductorDesignation.trim();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <CustomButton variant="ghost" className="p-0 hover:bg-transparent" onClick={handleBack}>
                    <ArrowLeft className="w-6 h-6 text-slate-400 hover:text-slate-700 transition-colors" />
                </CustomButton>
                <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Tax Details</h1>
            </div>

            <Card className="p-8">
                <form className="space-y-12" onSubmit={handleSave}>
                    {/* Organisation Tax Details */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-medium text-slate-800">Organisation Tax Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                    PAN<span className="text-red-500">*</span>
                                </label>
                                <CustomInput
                                    name="pan"
                                    value={formData.pan}
                                    onChange={handleChange}
                                    placeholder="AAAAA0000A"
                                    fullWidth
                                    error={errors.pan}
                                    maxLength={10}
                                    className="uppercase"
                                />
                                <span className="text-[10px] text-slate-400">Format: AAAAA0000A</span>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">TAN</label>
                                <CustomInput
                                    name="tan"
                                    value={formData.tan}
                                    onChange={handleChange}
                                    placeholder="AAAA00000A"
                                    fullWidth
                                    error={errors.tan}
                                    maxLength={10}
                                    className="uppercase"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                    TDS circle / AO code <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </label>
                                <div className="flex items-center gap-2">
                                    <CustomInput
                                        name="tdsCircle"
                                        value={formData.tdsCircle}
                                        onChange={handleChange}
                                        className="w-16 h-10 border border-slate-200 rounded-md text-center text-sm focus:ring-2 focus:ring-primary/20 outline-none uppercase"
                                        placeholder="AAA"
                                        maxLength={3}
                                    />
                                    <span className="text-slate-300">/</span>
                                    <CustomInput
                                        name="aoCode"
                                        value={formData.aoCode}
                                        onChange={handleChange}
                                        className="w-16 h-10 border border-slate-200 rounded-md text-center text-sm focus:ring-2 focus:ring-primary/20 outline-none uppercase"
                                        placeholder="AA"
                                        maxLength={2}
                                    />
                                    <span className="text-slate-300">/</span>
                                    <CustomInput
                                        name="rangeCode"
                                        value={formData.rangeCode}
                                        onChange={handleChange}
                                        className="w-16 h-10 border border-slate-200 rounded-md text-center text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="000"
                                        maxLength={3}
                                    />
                                    <span className="text-slate-300">/</span>
                                    <CustomInput
                                        name="aoType"
                                        value={formData.aoType}
                                        onChange={handleChange}
                                        className="w-12 h-10 border border-slate-200 rounded-md text-center text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="00"
                                        maxLength={2}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                    Tax Payment Frequency <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                                </label>
                                <CustomSelectbox
                                    name="taxPaymentFrequency"
                                    options={[{ label: 'Monthly', value: 'Monthly' }]}
                                    value="Monthly"
                                    onChange={handleChange}
                                    fullWidth
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tax Deductor Details */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-medium text-slate-800">Tax Deductor Details</h2>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-slate-700 block">Deductor's Type</label>
                            <div className="flex items-center gap-6">
                                <CustomRadioInput
                                    name="deductorType"
                                    value="Employee"
                                    checked={formData.deductorType === 'Employee'}
                                    onChange={handleDeductorTypeChange}
                                    className="w-4 h-4 text-primary border-slate-300 focus:ring-primary/20"
                                    label="Employee"
                                />
                                <CustomRadioInput
                                    name="deductorType"
                                    value="Non-Employee"
                                    checked={formData.deductorType === 'Non-Employee'}
                                    onChange={handleDeductorTypeChange}
                                    className="w-4 h-4 text-primary border-slate-300 focus:ring-primary/20"
                                    label="Non-Employee"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {formData.deductorType === 'Employee' ? (
                                <CustomSelectbox
                                    label="Deductor's Name"
                                    name="deductorName"
                                    options={employeeOptions}
                                    value={formData.employeeId || ''}
                                    onChange={handleEmployeeChange}
                                    fullWidth
                                    requiredIndicator={isEmployeeDeductorFilled}
                                    error={errors.employeeId}
                                />
                            ) : (
                                <CustomInput
                                    label="Deductor's Name"
                                    name="deductorName"
                                    value={formData.deductorName}
                                    onChange={handleChange}
                                    placeholder=""
                                    fullWidth
                                    requiredIndicator={isNonEmployeeDeductorFilled}
                                    error={errors.deductorName}

                                />
                            )}
                            <CustomInput
                                label="Deductor's Father's Name"
                                name="deductorFatherName"
                                value={formData.deductorFatherName}
                                onChange={handleChange}
                                placeholder=""
                                fullWidth
                                disabled={formData.deductorType === 'Employee' ? !formData.employeeId : false}
                                error={errors.deductorFatherName}
                                requiredIndicator={formData.deductorType === 'Employee' ? isEmployeeDeductorFilled : isNonEmployeeDeductorFilled}
                            />
                            {formData.deductorType === 'Non-Employee' && (
                                <CustomInput
                                    label="Deductor's Designation"
                                    name="deductorDesignation"
                                    value={formData.deductorDesignation}
                                    onChange={handleChange}
                                    placeholder=""
                                    fullWidth
                                    error={errors.deductorDesignation}
                                    requiredIndicator={isNonEmployeeDeductorFilled}
                                />
                            )}
                        </div>
                    </div>

                    <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
                        <CustomButton disabled={isLoading} variant="primary" type="submit" className="px-8 bg-primary hover:bg-primary-dark text-white border-none h-11">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto group" /> : "Save"}
                        </CustomButton>
                        <span className="text-xs text-red-400 font-medium">* indicates mandatory fields</span>
                    </div>
                </form>
            </Card>
        </div>
    );
};
export default React.memo(TaxDetails)