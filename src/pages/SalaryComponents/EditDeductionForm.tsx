import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import CustomRadioInput from "../../components/common/CustomRadioInput";
import CustomCheckbox from "../../components/common/CustomCheckbox";
import type { SalaryComponentItem } from "./SalaryComponentTable";
import { updateDeductionRequest, getDeductionDataRequest } from "../../redux/services/deductionSlice";
import type { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import type { SalaryCategory } from "../../redux/services/salaryComponentSlice";

interface DeductionFormData {
  slipName: string;
  deductionFrequency: "oneTime" | "recurring";
  isActive: boolean;
  categoryId: string;
}


interface EditDeductionFormProps {
  item: SalaryComponentItem;
  onCancel: () => void;
  onSave: () => void;
}

const EditDeductionForm: React.FC<EditDeductionFormProps> = ({
  item,
  onCancel,
  onSave,
}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<DeductionFormData>({
    slipName: "",
    deductionFrequency: "oneTime",
    isActive: true,
    categoryId: "",
  });

  const salaryCategories = useSelector(
    (state: RootState) => state?.salaryComponent?.salaryCategories
  );
  const { singleDeduction, loading } = useSelector(
    (state: RootState) => state.deduction
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const id = item._id;
    if (id) {
      dispatch(getDeductionDataRequest(String(id)));
    }
  }, [item._id, dispatch]);

  useEffect(() => {
    if (singleDeduction) {
      setFormData({
        slipName: singleDeduction.slipName || "",
        deductionFrequency: singleDeduction.deductionFrequency || "oneTime",
        isActive: singleDeduction.isActive,
        categoryId: singleDeduction.categoryId || "",
      });
    }
  }, [singleDeduction]);

  useEffect(() => {
    if (!formData.categoryId && salaryCategories?.length) {
      const deductionCat = salaryCategories.find(
        (cat: SalaryCategory) => cat.name?.toLowerCase() === "deduction"
      );
      if (deductionCat) {
        setFormData((prev: DeductionFormData) => ({ ...prev, categoryId: deductionCat._id }));
      }
    }
  }, [salaryCategories, formData.categoryId]);

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

  const handleFrequencyOneTime = useCallback(() => {
    handleFrequencyChange("oneTime");
  }, [handleFrequencyChange]);

  const handleFrequencyRecurring = useCallback(() => {
    handleFrequencyChange("recurring");
  }, [handleFrequencyChange]);

  const validate = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.slipName?.trim()) newErrors.slipName = "Name in Payslip is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.slipName]);



  const handleUpdate = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!validate()) return;

      const payload = {
        id: String(item._id),
        data: {
          slipName: formData.slipName,
          deductionFrequency: formData.deductionFrequency,
          isActive: formData.isActive,
          categoryId: formData.categoryId,
        },
      };

      dispatch(updateDeductionRequest(payload));
      onSave?.();
    },
    [validate, formData, item.id, dispatch, onSave]
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white min-h-[500px] relative"
    >
      {loading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-4">
        <h2 className="text-lg font-medium text-slate-800">Edit Deduction</h2>
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
        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Name in Payslip<span className="text-red-500">*</span>
              </label>
              <CustomInput
                name="slipName"
                value={formData.slipName}
                onChange={handleInputChange}
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
                  onChange={handleFrequencyOneTime}
                  className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                  label="One-time deduction"
                />

                <CustomRadioInput
                  name="deductionFrequency"
                  checked={formData.deductionFrequency === "recurring"}
                  onChange={handleFrequencyRecurring}
                  className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                  label="Recurring deduction for subsequent Payrolls"
                />
              </div>
            </div>

            <CustomCheckbox
              label="Mark this as Active"
              checked={formData.isActive}
              onChange={handleCheckboxChange}
              labelClassName="font-medium"
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
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default React.memo(EditDeductionForm);
