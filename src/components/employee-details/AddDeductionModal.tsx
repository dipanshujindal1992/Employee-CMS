import React, { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "../common/Modal";
import CustomButton from "../common/CustomButton";
import CustomSearchableSelect from "../common/CustomSearchableSelect";
import CustomInput from "../common/CustomInput";
import CustomSelectbox from "../common/CustomSelectbox";
import { Info } from "lucide-react";

const AMOUNT_TYPE_OPTIONS = [
    { label: "Fixed amount", value: "fixed" },
    { label: "% of Basic", value: "percentage" },
];

const END_CONDITION_OPTIONS = [
    { label: "Ends on selected month", value: "timeEnds" },
    { label: "Ends on recovering a specified amount", value: "amountRecovered" },
    { label: "Never ends", value: "neverEnds" },
];

export interface DeductionSaveData {
    deductionId: string;
    deductionName?: string;
    deductionAmount: string;
    deductionType: "fixed" | "percentage";
    deductionEnds: "neverEnds" | "timeEnds" | "amountRecovered";
    deductionEndsValue?: string;              // ISO date string for timeEnds
    deductionEndsAmountRecovered?: string;    // number string for amountRecovered
    isNew?: boolean;
}

interface AddDeductionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: DeductionSaveData) => void;
    existingDeductions?: Array<{ _id: string; slipName: string; deductionFrequency?: string }>;
    editData?: DeductionSaveData | null;
    errors?: Record<string, string>;
}

const AddDeductionModal: React.FC<AddDeductionModalProps> = ({
    isOpen,
    onClose,
    onSave,
    existingDeductions = [],
    editData,
    errors,
}) => {
    const [view, setView] = useState<"select" | "new">("select");
    const [selectedDeduction, setSelectedDeduction] = useState<string | number>("");
    const [deductionName, setDeductionName] = useState("");
    const [amountType, setAmountType] = useState("fixed");
    const [amountValue, setAmountValue] = useState("");
    const [endCondition, setEndCondition] = useState("neverEnds");
    const [endMonth, setEndMonth] = useState("");
    const [endAmount, setEndAmount] = useState("");
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            setLocalErrors(prev => ({ ...prev, ...errors }));
        }
    }, [errors]);

    
    useEffect(() => {
        if (editData && isOpen) {
            setView("select");
            setSelectedDeduction(editData.deductionId);
            setAmountType(editData.deductionType || "fixed");
            setAmountValue(editData.deductionAmount || "");
            setEndCondition(editData.deductionEnds || "neverEnds");
            setEndMonth(editData.deductionEndsValue ? String(editData.deductionEndsValue).substring(0, 7) : "");
            setEndAmount(editData.deductionEndsAmountRecovered || "");
        } else if (!isOpen) {
            // Clean up when modal closes natively
            resetStateAndClose();
        }
    }, [editData, isOpen]);

    const clearError = useCallback((field: string) => {
        setLocalErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    const deductionOptions = useMemo(() =>
        existingDeductions?.map((d) => ({ value: d?._id, label: d?.slipName })),
        [existingDeductions]
    );

    const selectedDeductionObj = useMemo(() => {
        if (editData && selectedDeduction === editData.deductionId) {
            return {
                _id: String(editData.deductionId),
                slipName: existingDeductions?.find(d => d._id === String(selectedDeduction))?.slipName || "Selected Deduction",
                deductionFrequency: "recurring",
            };
        }
        return existingDeductions?.find((d) => d?._id === String(selectedDeduction));
    }, [existingDeductions, selectedDeduction, editData]);

    const handleAddNew = useCallback(() => {
        setView("new");
    }, []);

    const handleAmountTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setAmountType(newType);
        if (newType === "percentage" && Number(amountValue) > 100) {
            setAmountValue("100");
        }
    }, [amountValue]);

    const handleAmountValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (amountType === "percentage") {
            const numVal = Number(val);
            if (val !== "" && (isNaN(numVal) || numVal < 0 || numVal > 100)) return;
        }
        setAmountValue(val);
        clearError("deductionAmount");
    }, [clearError, amountType]);

    const handleEndConditionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setEndCondition(e.target.value);
    }, []);

    const handleEndMonthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEndMonth(e.target.value);
        clearError("deductionEndsValue");
    }, [clearError]);

    const handleEndAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEndAmount(e.target.value);
        clearError("deductionEndsAmountRecovered");
    }, [clearError]);

    const handleDeductionNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setDeductionName(e.target.value);
        clearError("deductionName");
    }, [clearError]);

    const handleSelectedDeductionChange = useCallback((val: string | number) => {
        setSelectedDeduction(val);
        clearError("deductionId");
    }, [clearError]);

    const resetStateAndClose = useCallback(() => {
        setView("select");
        setSelectedDeduction("");
        setDeductionName("");
        setAmountType("fixed");
        setAmountValue("");
        setEndCondition("neverEnds");
        setEndMonth("");
        setEndAmount("");
        setLocalErrors({});
        onClose();
    }, [onClose]);

    const handleSave = useCallback(() => {
        const newErrors: Record<string, string> = {};

        if (view === "select" && !selectedDeduction) newErrors.deductionId = "Please select a deduction.";
        if (view === "new" && !deductionName.trim()) newErrors.deductionName = "Deduction name is required.";
        if (!amountValue) newErrors.deductionAmount = "Amount is required.";
        if (endCondition === "timeEnds" && !endMonth) newErrors.deductionEndsValue = "End month is required.";
        if (endCondition === "amountRecovered" && !endAmount) newErrors.deductionEndsAmountRecovered = "Target amount is required.";

        if (Object.keys(newErrors).length > 0) {
            setLocalErrors(newErrors);
            return;
        }

        if (onSave) {
            onSave({
                deductionId: view === "select" ? String(selectedDeduction) : deductionName,
                deductionAmount: amountValue,
                deductionType: amountType as "fixed" | "percentage",
                deductionEnds: endCondition as "neverEnds" | "timeEnds" | "amountRecovered",
                deductionEndsValue: endCondition === "timeEnds" ? endMonth : undefined,
                deductionEndsAmountRecovered: endCondition === "amountRecovered" ? endAmount : undefined,
                isNew: view === "new",
            });
        }
        resetStateAndClose();
    }, [onSave, view, selectedDeduction, deductionName, amountType, amountValue, endCondition, endMonth, endAmount, resetStateAndClose]);

    const amountAndEndFields = (
        <>
            {/* Amount */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                    Amount<span className="text-red-500">*</span>
                </label>
                <div className="flex items-start gap-3">
                    <div className="w-1/3">
                        <CustomSelectbox
                            fullWidth
                            options={AMOUNT_TYPE_OPTIONS}
                            value={amountType}
                            onChange={handleAmountTypeChange}
                        />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start gap-2">
                            <div className="flex-1">
                                <CustomInput
                                    fullWidth
                                    type="number"
                                    value={amountValue}
                                    onChange={handleAmountValueChange}
                                    error={localErrors.deductionAmount}
                                />
                            </div>
                            <span className="text-sm text-slate-500 whitespace-nowrap mt-2.5">per pay period</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* End Condition */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                    When do you want this recurring deduction to end?<span className="text-red-500">*</span>
                </label>
                <div className="flex items-start gap-3">
                    <div className="w-1/2">
                        <CustomSelectbox
                            fullWidth
                            options={END_CONDITION_OPTIONS}
                            value={endCondition}
                            onChange={handleEndConditionChange}
                        />
                    </div>
                    {endCondition === "timeEnds" && (
                        <div className="w-1/2">
                            <CustomInput
                                fullWidth
                                type="month"
                                placeholder="M yyyy"
                                value={endMonth}
                                onChange={handleEndMonthChange}
                                error={localErrors.deductionEndsValue}
                            />
                        </div>
                    )}
                    {endCondition === "amountRecovered" && (
                        <div className="w-1/2 flex items-start flex-col gap-1">
                            <div className="w-full flex items-start gap-2">
                                <span className="text-sm text-slate-500 mt-2.5">₹</span>
                                <div className="flex-1">
                                    <CustomInput
                                        fullWidth
                                        type="number"
                                        placeholder="Amount"
                                        value={endAmount}
                                        onChange={handleEndAmountChange}
                                        error={localErrors.deductionEndsAmountRecovered}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    const renderFooter = () => (
        <div className="flex justify-between items-center w-full">
            <div className="flex gap-3">
                <CustomButton variant="primary" onClick={handleSave}>Save</CustomButton>
                <CustomButton variant="outline" onClick={resetStateAndClose}>Cancel</CustomButton>
            </div>
            <p className="text-[11px] text-red-500 font-medium">* indicates mandatory fields</p>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={resetStateAndClose}
            title={editData ? "Edit Deductions" : "Add Deductions"}
            size="md"
            overflowVisible
            footer={renderFooter()}
        >
            <div className="py-2 space-y-5">
                {Object.keys(localErrors).length > 0 && (
                    <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-md border border-red-100 flex items-center gap-2">
                        <span className="font-semibold">Error:</span> Please fill in all required fields indicated by *.
                    </div>
                )}
                {view === "select" ? (
                    <>
                        {/* Deduction Selector */}
                        {editData && !existingDeductions?.find(d => d._id === String(selectedDeduction)) ? (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">
                                    Deduction Name<span className="text-red-500">*</span>
                                </label>
                                <CustomInput
                                    fullWidth
                                    value={editData.deductionName || "Custom Deduction"}
                                    disabled
                                />
                            </div>
                        ) : (
                            <CustomSearchableSelect
                                label="Select a Deduction"
                                requiredIndicator
                                options={deductionOptions}
                                value={selectedDeduction}
                                onChange={handleSelectedDeductionChange}
                                placeholder="Select"
                                onAddNew={handleAddNew}
                                addNewLabel="New Deduction"
                                error={localErrors.deductionId}
                                disabled={!!editData}
                            />
                        )}

                        {/* Info banner + extra fields shown once a deduction is selected */}
                        {selectedDeductionObj && (
                            <>
                                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-md px-3 py-2.5 text-sm text-amber-700">
                                    <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                                    <span>
                                        This is a{" "}
                                        <strong>
                                            {selectedDeductionObj.deductionFrequency === "recurring" ? "recurring" : "one-time"}
                                        </strong>{" "}
                                        deduction based on the following configuration.
                                    </span>
                                </div>
                                {amountAndEndFields}
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {/* New Deduction Name */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                Deduction Name<span className="text-red-500">*</span>
                            </label>
                            <CustomInput
                                fullWidth
                                value={deductionName}
                                onChange={handleDeductionNameChange}
                                error={localErrors.deductionName}
                                autoFocus
                            />
                        </div>
                        {amountAndEndFields}
                    </>
                )}
            </div>
        </Modal>
    );
};

export default React.memo(AddDeductionModal);
