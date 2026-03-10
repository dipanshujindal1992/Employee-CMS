import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import CustomRadioInput from "../../components/common/CustomRadioInput";
import CustomCheckbox from "../../components/common/CustomCheckbox";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { updateEarningRequest, type Earning } from "../../redux/services/earningSlice";
import { XCircle } from "lucide-react";
import { SALARY_CHECKBOX_OPTIONS } from "../../utils/Data";

interface EarningFormData {
  earningType: string;
  earningName: string;
  slipName: string;
  amount: string;
  isActive: boolean;
}

interface EditEarningFormProps {
  item: Earning;
  onCancel: () => void;
  onSave: () => void;
}

const EditEarningForm: React.FC<EditEarningFormProps> = ({
  item,
  onCancel,
  onSave,
}) => {
  const dispatch = useDispatch();
  const [calcType, setCalcType] = useState<"flat" | "percent">("flat");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<EarningFormData>({
    earningType: "",
    earningName: "",
    slipName: "",
    amount: "",
    isActive: true,
  });

  useEffect(() => {
    if (item) {
      setCalcType(item.isFlatAmount ? "flat" : "percent");
      setFormData({
        earningType:
          item.earningType ||
          (typeof item.earningId === "object" ? item.earningId?.name : "") ||
          item.name || "",
        earningName: item.earningName || item.name || "",
        slipName: item.slipName || item.earningName || item.name || "",
        amount: item.amount?.toString() || "0",
        isActive: item.isActive ?? true,
      });
    }
  }, [item]);

  const validate = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.earningName?.trim()) {
      newErrors.earningName = "Earning name is required.";
    }

    if (!formData.slipName?.trim()) {
      newErrors.slipName = "Payslip name is required.";
    }

    if (!formData.amount?.trim()) {
      newErrors.amount = "Amount/Percentage is required";
    } else {
      const amountVal = Number(formData.amount);
      if (isNaN(amountVal)) {
        newErrors.amount = "Value must be a number";
      } else if (amountVal < 0) {
        newErrors.amount = "Value cannot be negative";
      } else if (calcType === "percent" && amountVal > 100) {
        newErrors.amount = "Percentage cannot exceed 100%";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, calcType]);

  const handleSave = useCallback(() => {
    if (!validate()) return;

    const payload = {
      earningType: formData.earningType,
      earningName: formData.earningName,
      slipName: formData.slipName,
      amount: parseFloat(formData.amount),
      isFlatAmount: calcType === "flat",
      isActive: formData.isActive,
      earningId:
        typeof item?.earningId === "object"
          ? item?.earningId?._id
          : item?.earningId,
    };

    dispatch(updateEarningRequest({ id: item?._id || "", data: payload }));
    onSave?.();
  }, [validate, formData, calcType, item, dispatch, onSave]);

  const handleInputChange = useCallback((name: keyof EarningFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (prev[name]) {
        return { ...prev, [name]: "" };
      }
      return prev;
    });
  }, []);

  const handleEarningNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange("earningName", e.target.value);
  }, [handleInputChange]);

  const handleSlipNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange("slipName", e.target.value);
  }, [handleInputChange]);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange("amount", e.target.value);
  }, [handleInputChange]);

  const handleIsActiveChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange("isActive", e.target.checked);
  }, [handleInputChange]);

  const handleSetFlatCalcType = useCallback(() => setCalcType("flat"), []);
  const handleSetPercentCalcType = useCallback(() => setCalcType("percent"), []);

  if (!item) return <div>Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-4">
        <h2 className="text-lg font-medium text-slate-800">Edit Earning</h2>
        <div className="flex items-center gap-4">
          <CustomButton
            onClick={onCancel}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <XCircle className="w-5 h-5 text-slate-400" />
          </CustomButton>
        </div>
      </div>

      <div className="p-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Earning Type <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <CustomInput
                  disabled
                  value={formData.earningType}
                  className="bg-slate-50 border-slate-200 cursor-not-allowed text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Earning Name<span className="text-red-500">*</span>
              </label>
              <CustomInput
                name="earningName"
                value={formData.earningName}
                onChange={handleEarningNameChange}
                className="focus:ring-primary/20 border-blue-300"
                error={errors.earningName}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Name in Payslip<span className="text-red-500">*</span>
              </label>
              <CustomInput
                name="slipName"
                value={formData.slipName}
                onChange={handleSlipNameChange}
                className="bg-slate-50 border-slate-200"
                error={errors.slipName}
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-700 block">
                Calculation Type<span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <CustomRadioInput
                  name="calcType"
                  checked={calcType === "flat"}
                  onChange={handleSetFlatCalcType}
                  className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                  label="Flat Amount"
                />
                <CustomRadioInput
                  name="calcType"
                  checked={calcType === "percent"}
                  onChange={handleSetPercentCalcType}
                  className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                  label={formData.earningType === "Basic" ? "Percentage of CTC" : "Percentage of Basic"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 block">
                {calcType === "flat" ? "Enter Amount" : "Enter Percentage"}
              </label>
              <div className="flex items-stretch max-w-[240px]">
                {calcType === "flat" && (
                  <div className="px-3 py-2 bg-slate-50 border border-slate-300 border-r-0 rounded-l-md text-slate-500 text-sm flex items-center font-medium">
                    ₹
                  </div>
                )}
                <CustomInput
                  name="amount"
                  value={formData.amount}
                  type="number"
                  onChange={handleAmountChange}
                  className={clsx(
                    "w-full px-3 py-2 text-sm border focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400",
                    calcType === "flat"
                      ? "rounded-r-md border-slate-300"
                      : "rounded-l-md  border-slate-300",
                    errors.amount
                      ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                      : ""
                  )}
                  placeholder={calcType === "flat" ? "0" : "0.00"}
                />
                {calcType === "percent" && (
                  <div className="px-3 py-2 bg-slate-50 border border-slate-300  rounded-r-md text-slate-500 text-sm flex items-center font-medium">
                    %
                  </div>
                )}
              </div>
              {errors.amount && (
                <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
              )}
            </div>

            <CustomCheckbox
              label="Mark this as Active"
              checked={formData?.isActive}
              onChange={handleIsActiveChange}
              labelClassName="font-medium"
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-700">
              Other Configurations
            </h3>
            <div className="space-y-4">
              {SALARY_CHECKBOX_OPTIONS?.map((config, i) => (
                <div key={i} className="space-y-1">
                  <CustomCheckbox
                    label={config?.label}
                    checked={config?.checked}

                  />
                  {config?.subText && (
                    <p className="ml-6 text-xs text-slate-500 leading-relaxed max-w-sm">
                      {config?.subText}
                    </p>
                  )}
                </div>
              ))}

              <div className="space-y-2">
                <CustomCheckbox
                  label="Consider for EPF Contribution"
                  checked={true}
                  disabled

                />
                <div className="ml-6 space-y-2">
                  <CustomRadioInput
                    name="epfRule"
                    disabled
                    className="w-3 h-3 text-primary border-slate-300 px-1 py-1"
                    label="Always"
                  />
                  <CustomRadioInput
                    name="epfRule"
                    defaultChecked
                    className="w-3.5 h-3.5 text-primary border-slate-300"
                    label="Only when PF Wage is less than ₹ 15,000"
                  />
                </div>
              </div>

              <CustomCheckbox
                label="Consider for ESI Contribution"
                checked={true}
                disabled

              />

              <CustomCheckbox
                label="Show this component in payslip"
                checked={true}
                disabled

              />
            </div>

            <div className="p-3 bg-orange-50/50 border border-orange-100/50 rounded-md mt-6">
              <p className="text-[11px] text-orange-800 leading-relaxed">
                <span className="font-bold">Note:</span> Once you associate this
                component with an employee, you will only be able to edit the
                Name and Amount/Percentage. The changes you make to
                Amount/Percentage will apply only to new employees.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Divider */}
        <div className="border-t border-slate-200 mt-8 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CustomButton
                onClick={handleSave}
                variant="primary"
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
              >
                Save
              </CustomButton>
              <CustomButton
                onClick={onCancel}
                variant="ghost"
                className="px-6 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </CustomButton>
            </div>

            <p className="text-xs text-red-500 font-medium">
              * indicates mandatory fields
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(EditEarningForm);
