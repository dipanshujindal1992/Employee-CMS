import React from "react";
import clsx from "clsx";
import CustomInput from "../../common/CustomInput";
import type { EmployeeFormData } from "../Step2SalaryDetails";

interface SalaryHeaderProps {
    formData: Partial<EmployeeFormData>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors?: Record<string, string>;
}

const SalaryHeader: React.FC<SalaryHeaderProps> = ({
    formData,
    handleInputChange,
    errors,
}) => {
    return (
        <div className="mb-6">
            <h3 className="text-[15px] font-semibold text-slate-800 mb-1">Salary Structure</h3>
            <p className="text-sm text-slate-500 mb-6">
                Set how the employee's salary is divided for accurate pay calculation.
            </p>

            <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700 min-w-[120px]">
                    <span className="text-red-500 mr-1">*</span>Annual CTC
                </label>
                <div className="relative flex flex-col max-w-[300px] flex-1">
                    <div className="relative flex items-center w-full">
                        <span className="absolute left-3 text-slate-500 font-medium z-10">₹</span>
                        <CustomInput
                            type="text"
                            name="annualCTC"
                            value={formData?.annualCTC || ""}
                            onChange={handleInputChange}
                            className={clsx(
                                "w-full pl-8 pr-[70px] py-[6px] border !rounded-md focus:outline-none transition-all text-slate-800 font-medium",
                                errors?.annualCTC ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            )}
                            placeholder="0"
                            maxLength={15}
                        />
                        <span className="absolute right-8 text-slate-400 text-xs font-medium bg-white px-1">per year</span>
                    </div>
                    {errors?.annualCTC && (
                        <span className="text-xs text-red-500 mt-1">{errors?.annualCTC}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(SalaryHeader);
