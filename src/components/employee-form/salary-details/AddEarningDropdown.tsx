import React, { useMemo } from "react";
import CustomButton from "../../common/CustomButton";

interface AddEarningDropdownProps {
    hraOptions: any[];
    conveyanceOptions: any[];
    customAllowanceOptions: any[];
    formData: any;
    isAddEarningOpen: boolean;
    toggleAddEarning: () => void;
    handleAddHRA: () => void;
    handleAddConveyance: () => void;
    handleAddOther: (item: any) => void;
    hasHRA: boolean;
    hasConveyance: boolean;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
}

const AddEarningDropdown: React.FC<AddEarningDropdownProps> = ({
    hraOptions,
    conveyanceOptions,
    customAllowanceOptions,
    formData,
    isAddEarningOpen,
    toggleAddEarning,
    handleAddHRA,
    handleAddConveyance,
    handleAddOther,
    hasHRA,
    hasConveyance,
    dropdownRef,
}) => {

    const addEarningDropdown = useMemo(() => {
        if (!isAddEarningOpen) return null;

        const availableCustoms = customAllowanceOptions.filter(
            (opt) => !formData?.earnings?.some((e: any) => e.id === `custom_${opt.value}`)
        );

        const hasItems = !hasHRA || !hasConveyance || availableCustoms.length > 0;

        return (
            <div className="absolute left-6 mt-2 w-64 bg-white border border-slate-200 shadow-lg rounded-md py-1 z-50 overflow-hidden">
                {hasItems ? (
                    <div className="flex flex-col">
                        {!hasHRA && (
                            <CustomButton
                                variant="none"
                                type="button"
                                className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                onClick={handleAddHRA}
                            >
                                House Rent Allowance
                            </CustomButton>
                        )}

                        {!hasConveyance && (
                            <CustomButton
                                variant="none"
                                type="button"
                                className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                onClick={handleAddConveyance}
                            >
                                Conveyance Allowance
                            </CustomButton>
                        )}

                        {availableCustoms?.map((opt) => (
                            <CustomButton
                                key={opt.value}
                                variant="none"
                                type="button"
                                className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                onClick={() => handleAddOther(opt)}
                            >
                                {opt?.label}
                            </CustomButton>
                        ))}
                    </div>
                ) : (
                    <div className="px-4 py-3 text-[13px] text-slate-500 text-center font-medium">
                        No more allowances available
                    </div>
                )}
            </div>
        );
    }, [
        isAddEarningOpen,
        customAllowanceOptions,
        formData?.earnings,
        hasHRA,
        hasConveyance,
        handleAddHRA,
        handleAddConveyance,
        handleAddOther
    ]);


    const addEarningButton = useMemo(() => {
        return hraOptions?.length === 0 && conveyanceOptions?.length === 0 ? (
            <div className="flex flex-col gap-1">
                <CustomButton
                    variant="none"
                    type="button"
                    disabled
                    className="text-slate-400 text-sm font-medium flex items-center gap-1 cursor-not-allowed"
                >
                    + Add Earning
                </CustomButton>

                <span className="text-xs text-orange-500 font-medium whitespace-nowrap">
                    Please add House Rent Allowance and Conveyance Allowance from Salary Components first.
                </span>
            </div>
        ) : (
            <CustomButton
                variant="none"
                type="button"
                onClick={toggleAddEarning}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
                + Add Earning
            </CustomButton>
        );
    }, [hraOptions, conveyanceOptions, toggleAddEarning]);
    return (
        <div className="px-6 py-4 relative" ref={dropdownRef}>
            {addEarningButton}

            {addEarningDropdown}
        </div>
    );
};

export default React.memo(AddEarningDropdown);
