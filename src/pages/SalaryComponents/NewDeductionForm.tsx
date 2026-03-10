import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import CustomRadioInput from "../../components/common/CustomRadioInput";
import CustomCheckbox from "../../components/common/CustomCheckbox";
import { useDispatch, useSelector } from "react-redux";
import { createDeductionRequest } from "../../redux/services/deductionSlice";
import type { RootState } from "../../redux/store";
import type { SalaryCategory } from "../../redux/services/salaryComponentSlice";

interface NewDeductionFormProps {
    onCancel: () => void;
    onSave: () => void;
}

interface DeductionFormData {
    slipName: string;
    deductionFrequency: "oneTime" | "recurring";
    isActive: boolean;
    categoryId: string;
}

const NewDeductionForm: React.FC<NewDeductionFormProps> = ({
    onCancel,
    onSave,
}) => {
    const dispatch = useDispatch();

    const salaryCategories = useSelector(
        (state: RootState) => state?.salaryComponent?.salaryCategories
    );

    const [formData, setFormData] = useState<DeductionFormData>({
        slipName: "",
        deductionFrequency: "oneTime",
        isActive: true,
        categoryId: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Auto-set categoryId to "Deduction" category if found
    useEffect(() => {
        if (salaryCategories?.length) {
            const deductionCat = salaryCategories.find(
                (cat: SalaryCategory) => cat.name?.toLowerCase() === "deduction"
            );
            if (deductionCat) {
                setFormData((prev: DeductionFormData) => ({ ...prev, categoryId: deductionCat._id }));
            }
        }
    }, [salaryCategories]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormData((prev: DeductionFormData) => ({ ...prev, [name]: value }));
            setErrors((prev: Record<string, string>) => {
                if (prev[name]) {
                    return { ...prev, [name]: "" };
                }
                return prev;
            });
        },
        []
    );

    const handleFrequencyChange = useCallback((value: "oneTime" | "recurring") => {
        setFormData((prev: DeductionFormData) => ({ ...prev, deductionFrequency: value }));
    }, []);

    const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev: DeductionFormData) => ({ ...prev, isActive: e.target.checked }));
    }, []);

    const validate = useCallback(() => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.slipName?.trim()) newErrors.slipName = "Name in Payslip is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData.slipName]);

    const handleSave = useCallback(
        (e?: React.FormEvent) => {
            if (e) e.preventDefault();
            if (!validate()) return;

            dispatch(createDeductionRequest(formData));
            onSave?.();
        },
        [validate, formData, dispatch, onSave]
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white min-h-[500px]"
        >
            <div className="flex items-center justify-between border-b border-slate-100 px-8 py-4">
                <h2 className="text-lg font-medium text-slate-800">New Deduction</h2>
                <div className="flex items-center gap-4">
                    <CustomButton
                        onClick={onCancel}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                        variant="none"
                    >
                        <XCircle className="w-5 h-5 text-slate-400" />
                    </CustomButton>
                </div>
            </div>

            <div className="p-8 max-w-2xl">
                <form onSubmit={handleSave} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                Name in Payslip<span className="text-red-500">*</span>
                            </label>
                            <CustomInput
                                name="slipName"
                                value={formData.slipName}
                                onChange={handleInputChange}
                                placeholder="Enter name in payslip"
                                className="focus:ring-primary/20 border-slate-300"
                                error={errors.slipName}
                                maxLength={50}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700">
                                Select the deduction frequency<span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2">
                                <CustomRadioInput
                                    name="deductionFrequency"
                                    checked={formData.deductionFrequency === "oneTime"}
                                    onChange={() => handleFrequencyChange("oneTime")}
                                    className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                                    label="One-time deduction"
                                />

                                <CustomRadioInput
                                    name="deductionFrequency"
                                    checked={formData.deductionFrequency === "recurring"}
                                    onChange={() => handleFrequencyChange("recurring")}
                                    className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                                    label="Recurring deduction for subsequent Payrolls"
                                />
                            </div>
                        </div>

                        <CustomCheckbox
                            label="Mark this as Active"
                            checked={formData.isActive}
                            onChange={handleCheckboxChange}
                        />

                        <div className="p-4 bg-orange-50/50 border border-orange-100/50 rounded-lg">
                            <p className="text-xs text-orange-800 leading-relaxed">
                                <span className="font-bold">Note:</span> Once you associate this benefits with an employee, you will only be able to edit the Name in Payslip. The change will be reflected in both new and existing employees.
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                        <div className="flex items-center gap-3">
                            <CustomButton
                                type="submit"
                                variant="primary"
                                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                            >
                                Save
                            </CustomButton>
                            <CustomButton
                                onClick={onCancel}
                                variant="ghost"
                                className="px-6 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50"
                                type="button"
                            >
                                Cancel
                            </CustomButton>
                        </div>
                        <p className="text-[11px] text-red-500 mt-4">
                            * indicates mandatory fields
                        </p>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default React.memo(NewDeductionForm);
