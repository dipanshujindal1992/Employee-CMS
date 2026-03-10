import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Plus, XCircle } from "lucide-react";
import CustomButton from "../../components/common/CustomButton";
import CustomInput from "../../components/common/CustomInput";
import CustomRadioInput from "../../components/common/CustomRadioInput";
import CustomCheckbox from "../../components/common/CustomCheckbox";

import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {
  fetchEarningTypeRequest,
  type EarningType,
  type SalaryCategory,
} from "../../redux/services/salaryComponentSlice";
import { addEarningRequest } from "../../redux/services/earningSlice";

interface NewEarningFormProps {
  onCancel: () => void;
  onSave: () => void;
}

interface EarningFormData {
  name: string;
  payslipName: string;
  amount: string;
  payType: "fixed" | "variable";
  isActive: boolean;
  isPartOfSalary: boolean;
  isTaxable: boolean;
  isProrata: boolean;
  epf: boolean;
  esi: boolean;
  showInPayslip: boolean;
  description: string;
}

const NewEarningForm: React.FC<NewEarningFormProps> = ({
  onCancel,
  onSave,
}) => {
  const dispatch = useDispatch();

  // Redux Selectors
  const earningTypes = useSelector(
    (state: RootState) => state?.salaryComponent?.earningTypes
  );
  const salaryCategories = useSelector(
    (state: RootState) => state?.salaryComponent?.salaryCategories
  );
  // Local State
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [calcType, setCalcType] = useState<"flat" | "percent">("flat");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<EarningFormData>({
    name: "",
    payslipName: "",
    amount: "",
    payType: "fixed",
    isActive: true,
    isPartOfSalary: true,
    isTaxable: true,
    isProrata: true,
    epf: true,
    esi: true,
    showInPayslip: true,
    description: "",
  });

  // Initial Fetch
  useEffect(() => {
    dispatch(fetchEarningTypeRequest());
  }, [dispatch]);
  const customAllowanceId = useMemo(() => {
    const custom = earningTypes?.find(
      (item: EarningType) =>
        item?.name?.toLowerCase() === "custom allowance"
    );

    return custom?._id || null;
  }, [earningTypes]);
  // Derived State
  const filteredOptions = useMemo((): EarningType[] => {
    if (!earningTypes) return [];

    const term = searchTerm.toLowerCase();

    return earningTypes
      .filter(
        (item: EarningType) =>
          item._id !== customAllowanceId // hide custom allowance
      )
      .filter((item: EarningType) =>
        item?.name?.toLowerCase().includes(term)
      );
  }, [earningTypes, searchTerm, customAllowanceId]);


  // Handlers
  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleSearchClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleTypeSelect = useCallback(
    (typeName: string) => {
      setSelectedType(typeName);
      setIsOpen(false);
      setErrors((prev) => ({ ...prev, selectedType: "" }));
    },
    []
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => {
        if (prev[name]) {
          return { ...prev, [name]: "" };
        }
        return prev;
      });
    },
    []
  );

  const handleCheckboxChange = useCallback(
    (name: string, checked: boolean) => {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    },
    []
  );

  const handlePayTypeChange = useCallback((value: "fixed" | "variable") => {
    setFormData((prev) => ({ ...prev, payType: value }));
  }, []);

  const handleCalcTypeChange = useCallback((value: "flat" | "percent") => {
    setCalcType(value);
  }, []);

  const validate = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedType) newErrors.selectedType = "Earning type is required.";
    if (!formData.name?.trim()) newErrors.name = "Earning name is required.";
    if (!formData.payslipName?.trim())
      newErrors.payslipName = "Payslip name is required.";

    const amountStr = formData.amount?.toString() || "";
    if (!amountStr.trim()) {
      newErrors.amount = "Amount/Percentage is required.";
    } else {
      const amountVal = Number(amountStr);
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
  }, [calcType, formData.amount, formData.name, formData.payslipName, selectedType]);

  const earningOptionsList = useMemo(
    () => [
      {
        label: "Make this earning a part of the employee's salary structure",
        name: "isPartOfSalary",
        checked: formData.isPartOfSalary,
      },
      {
        label: "This is a taxable earning",
        name: "isTaxable",
        checked: formData.isTaxable,
        subText:
          "The income tax amount will be divided equally and deducted every month across the financial year.",
      },
      {
        label: "Calculate on pro-rata basis",
        name: "isProrata",
        checked: formData.isProrata,
        subText:
          "Pay will be adjusted based on employee working days.",
      },
    ],
    [
      formData.isPartOfSalary,
      formData.isTaxable,
      formData.isProrata,
    ]
  );

  const handleSave = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!validate()) return;

      const earningId = earningTypes?.find(
        (et: EarningType) => et.name === selectedType
      )?._id || "";

      const categoryId = salaryCategories?.find(
        (sc: SalaryCategory) => sc.name === "Earning" || sc.name === "Earnings"
      )?._id || "";

      const payload = {
        earningId: earningId || customAllowanceId || "",
        categoryId,
        earningName: formData.name,
        slipName: formData.payslipName,
        isFlatAmount: calcType === "flat",
        amount: Number(formData.amount),
        isActive: formData.isActive,
        showInPayslip: formData.showInPayslip,
        earningType: selectedType,
        description: formData.description,

      };

      dispatch(addEarningRequest(payload));
      onSave?.();
    },
    [
      validate,
      earningTypes,
      selectedType,
      salaryCategories,
      formData,
      calcType,
      dispatch,
      onSave,
    ]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white min-h-screen"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-4">
        <h2 className="text-lg font-medium text-slate-800">New Earning</h2>
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

      <div className="p-8 max-w-6xl">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Earning Type Dropdown - Always Visible */}
          {/* Earning Type Section */}
          <div className="space-y-2 max-w-lg">
            <label className="text-sm font-medium text-slate-700 block">
              Earning Type <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <div
                onClick={toggleDropdown}
                className={clsx(
                  "w-full px-4 py-2.5 bg-white border rounded-md text-sm cursor-pointer flex items-center justify-between shadow-sm transition-all",
                  isOpen
                    ? "border-blue-400 ring-2 ring-blue-100"
                    : "border-slate-300 hover:border-slate-400",
                  errors.selectedType ? "border-red-500" : ""
                )}
              >
                <span
                  className={
                    selectedType ? "text-slate-700" : "text-slate-400"
                  }
                >
                  {selectedType || "Select"}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <CustomInput
                          autoFocus
                          type="text"
                          placeholder="Search types..."
                          className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                          value={searchTerm}
                          onChange={handleSearchChange}
                          onClick={handleSearchClick}
                        />
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                      {filteredOptions?.length > 0 ? (
                        filteredOptions?.map((opt: EarningType) => (
                          <div
                            key={opt?._id || opt?.name}
                            className="px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                            onClick={() => handleTypeSelect(opt?.name)}
                          >
                            {opt?.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-sm text-slate-400 text-center">
                          No results found
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 p-2 bg-slate-50">
                      <CustomButton
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md font-medium flex items-center gap-2 transition-colors"
                        onClick={() => handleTypeSelect("Custom Allowance")}
                      >
                        <Plus className="w-4 h-4" />
                        Create Custom Allowance
                      </CustomButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {errors.selectedType && (
              <p className="text-xs text-red-500 mt-1">
                {errors.selectedType}
              </p>
            )}

            {selectedType && (
              <div className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-md border border-blue-100 mt-2 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center text-[10px] font-bold">
                  i
                </div>
                Fixed amount paid at the end of every month.
              </div>
            )}
          </div>

          {/* Detailed Form - Visible only when type is selected */}
          {selectedType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16"
            >
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Earning Name<span className="text-red-500">*</span>
                  </label>
                  <CustomInput
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Special Allowance"
                    className="focus:ring-primary/20 border-blue-300"
                    error={errors.name}
                    maxLength={30}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Name in Payslip<span className="text-red-500">*</span>
                  </label>
                  <CustomInput
                    name="payslipName"
                    value={formData.payslipName}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-slate-200"
                    error={errors.payslipName}
                    maxLength={30}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <CustomInput
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Optional description"
                    className="bg-slate-50 border-slate-200"
                    maxLength={50}
                  />
                </div>

                {selectedType === "Custom Allowance" && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700">
                      Pay Type<span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <CustomRadioInput
                        name="payType"
                        checked={formData.payType === "fixed"}
                        onChange={() => handlePayTypeChange("fixed")}
                        className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                        label="Fixed Pay (Fixed amount paid at the end of every month.)"
                      />
                      <CustomRadioInput
                        name="payType"
                        checked={formData.payType === "variable"}
                        onChange={() => handlePayTypeChange("variable")}
                        className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                        label="Variable Pay (Variable amount paid during any payroll.)"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-700 block">
                    Calculation Type<span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <CustomRadioInput
                      name="calcType"
                      checked={calcType === "flat"}
                      onChange={() => handleCalcTypeChange("flat")}
                      className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                      label="Flat Amount"
                    />

                    <CustomRadioInput
                      name="calcType"
                      checked={calcType === "percent"}
                      onChange={() => handleCalcTypeChange("percent")}
                      className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                      label={
                        selectedType === "Basic"
                          ? "Percentage of CTC"
                          : "Percentage of Basic"
                      }
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
                      type="number"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className={clsx(
                        "w-full px-3 py-2 text-sm border focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400",
                        calcType === "flat"
                          ? "rounded-r-md border-slate-300"
                          : "rounded-l-md  border-slate-300",
                        errors.amount ? "border-red-500 focus:ring-red-200 focus:border-red-500" : ""
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
                  checked={formData.isActive}
                  onChange={(e) =>
                    handleCheckboxChange("isActive", e.target.checked)
                  }
                  labelClassName="font-medium"
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-slate-700">
                  Other Configurations
                </h3>
                <div className="space-y-4">
                  {earningOptionsList?.map((config, i) => (
                    <div key={i} className="space-y-1">
                      <CustomCheckbox
                        label={config.label}
                        checked={config.checked}
                        onChange={(e) =>
                          handleCheckboxChange(config.name, e.target.checked)
                        }
                      />
                      {config.subText && (
                        <p className="ml-6 text-xs text-slate-500 leading-relaxed max-w-sm">
                          {config.subText}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="space-y-2">
                    <CustomCheckbox
                      label="Consider for EPF Contribution"
                      checked={formData.epf}
                      onChange={(e) =>
                        handleCheckboxChange("epf", e.target.checked)
                      }
                    />
                    <div className="ml-6 space-y-2">
                      <CustomRadioInput
                        name="epfRuleNew"
                        disabled
                        className="w-3 h-3 text-primary border-slate-300 px-1 py-1"
                        label="Always"
                      />
                      <CustomRadioInput
                        name="epfRuleNew"
                        defaultChecked
                        className="w-3.5 h-3.5 text-primary border-slate-300"
                        label="Only when PF Wage is less than ₹ 15,000"
                      />
                    </div>
                  </div>

                  <CustomCheckbox
                    label="Consider for ESI Contribution"
                    checked={formData.esi}
                    onChange={(e) =>
                      handleCheckboxChange("esi", e.target.checked)
                    }
                  />

                  <CustomCheckbox
                    label="Show this component in payslip"
                    checked={formData.showInPayslip}
                    onChange={(e) =>
                      handleCheckboxChange("showInPayslip", e.target.checked)
                    }
                  />
                </div>

                <div className="p-3 bg-orange-50/50 border border-orange-100/50 rounded-md mt-6">
                  <p className="text-[11px] text-orange-800 leading-relaxed">
                    <span className="font-bold">Note:</span> Once you associate
                    this component with an employee, you will only be able to
                    edit the Name and Amount/Percentage. The changes you make to
                    Amount/Percentage will apply only to new employees.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer Divider */}
          <div className="border-t border-slate-200 mt-8 pt-6">
            <div className="flex items-center justify-between">
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

              <p className="text-xs text-red-500 font-medium">
                * indicates mandatory fields
              </p>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default React.memo(NewEarningForm);
