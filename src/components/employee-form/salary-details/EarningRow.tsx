import React, { useMemo, useCallback } from "react";
import { X } from "lucide-react";
import CustomSearchableSelect from "../../common/CustomSearchableSelect";
import CustomInput from "../../common/CustomInput";
import CustomButton from "../../common/CustomButton";
import type { EarningItem } from "../Step2SalaryDetails";

interface EarningRowProps {
  earning: any;
  index: number;
  basicOptions: any[];
  hraOptions: any[];
  conveyanceOptions: any[];
  handleEarningChange: (
    id: string,
    field: keyof EarningItem,
    value: string | number
  ) => void;
  handleRemoveEarning: (id: string) => void;
  handleEarningValueChange: (
    id: string,
    isPercentage: boolean,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  navigate: any;
  ROUTES: any;
}

const EarningRow: React.FC<EarningRowProps> = ({
  earning,
  index,
  basicOptions,
  hraOptions,
  conveyanceOptions,
  handleEarningChange,
  handleRemoveEarning,
  handleEarningValueChange,
  navigate,
  ROUTES,
}) => {
  /* ================= MEMOIZED FLAGS ================= */

  const { isBasic, isHRA, isConveyance, isDynamicDropdown } = useMemo(() => {
    const basic = earning?.id === "basic";
    const hra = earning?.id === "hra_group";
    const conveyance = earning?.id === "conveyance_group";

    return {
      isBasic: basic,
      isHRA: hra,
      isConveyance: conveyance,
      isDynamicDropdown: basic || hra || conveyance,
    };
  }, [earning?.id]);

  const currentOptions = useMemo(() => {
    if (isHRA) return hraOptions;
    if (isConveyance) return conveyanceOptions;
    return basicOptions;
  }, [isHRA, isConveyance, basicOptions, hraOptions, conveyanceOptions]);

  const selectedItem = useMemo(() => {
    if (!isDynamicDropdown) return null;
    return currentOptions?.find((opt) => opt?.value === earning?.name);
  }, [currentOptions, earning?.name, isDynamicDropdown]);


  const isPercentage = useMemo(() => {
    return (
      earning?.derivedType === "% of CTC" ||
      earning?.derivedType === "% of Basic"
    );
  }, [earning?.derivedType]);


  const { derivedLabel, derivedTitle } = useMemo(() => {
    if (earning?.derivedType) {
      const label =
        earning.derivedType === "Fixed amount"
          ? "Fixed Amount"
          : earning.derivedType;

      return { derivedLabel: label, derivedTitle: label };
    }

    if (isDynamicDropdown && !earning?.name) {
      return { derivedLabel: "Component not selected", derivedTitle: "" };
    }

    return {
      derivedLabel: isBasic
        ? "% of CTC"
        : isHRA || isConveyance
        ? "% of Basic"
        : "Fixed Amount",
      derivedTitle: "",
    };
  }, [earning?.derivedType, earning?.name, isBasic, isHRA, isConveyance, isDynamicDropdown]);


  const onRemove = useCallback(() => {
    handleRemoveEarning(earning?.id);
  }, [handleRemoveEarning, earning?.id]);

  const onValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleEarningValueChange(earning?.id, isPercentage, e);
    },
    [handleEarningValueChange, earning?.id, isPercentage]
  );

  const onSelectChange = useCallback(
    (val: string | number) => {
      handleEarningChange(earning?.id, "name", val);
    },
    [handleEarningChange, earning?.id]
  );

  const handleAddNew = useCallback(() => {
    navigate(ROUTES.SALARY_COMPONENTS);
  }, [navigate, ROUTES.SALARY_COMPONENTS]);



  return (
    <div
      className="grid grid-cols-12 gap-4 px-6 py-4 items-center group relative"
      style={{ zIndex: 100 - index }}
    >
      {/* Name */}
      <div className="col-span-4 pr-4">
        {isDynamicDropdown ? (
          <div className="flex items-center justify-between group-hover:bg-slate-50 p-1 -ml-1 rounded transition-colors w-full">
            <CustomSearchableSelect
              key={`${earning?.id}_${currentOptions?.length}`}
              options={currentOptions || []}
              value={earning?.name}
              onChange={onSelectChange}
              placeholder="Select..."
              className="w-full flex-1"
              onAddNew={
                !currentOptions || currentOptions?.length === 0
                  ? handleAddNew
                  : undefined
              }
              addNewLabel="Add Earning"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between group-hover:bg-slate-50 p-1 -ml-1 rounded transition-colors">
            <span className="text-sm font-medium text-slate-700">
              {earning?.name}
            </span>

            <CustomButton
              variant="none"
              onClick={onRemove}
              className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-50 rounded ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </CustomButton>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="col-span-4 flex items-center gap-0">
        <CustomInput
          type="number"
          value={earning?.value}
          onChange={onValueChange}
          maxLength={isPercentage ? 3 : undefined}
          className="w-24 px-3 py-1.5 border border-slate-300 !rounded-l-md !rounded-r-none text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 z-10 bg-white m-0 h-[34px]"
          placeholder="0.00"
        />

        <div className="w-[180px] px-2 py-1.5 border border-l-0 border-slate-300 rounded-r-md text-[11px] bg-slate-50 text-slate-600 flex items-center overflow-hidden h-[34px]">
          {!selectedItem && !isHRA && !isConveyance ? (
            <span className="text-slate-400">Component not selected</span>
          ) : (
            <div className="truncate" title={derivedTitle}>
              <strong>{derivedLabel}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Monthly */}
      <div className="col-span-2 text-right">
        <div className="bg-slate-50/80 px-3 py-1.5 rounded text-sm text-slate-600 font-medium inline-block min-w-[80px] text-right">
          {Math.round((earning?.amount || 0) / 12)}
        </div>
      </div>

      {/* Annual */}
      <div className="col-span-2 text-right">
        <div className="bg-slate-50/80 px-3 py-1.5 rounded text-sm text-slate-800 font-medium inline-block min-w-[80px] text-right">
          {Math.round(earning?.amount || 0)}
        </div>
      </div>
    </div>
  );
};

export default React.memo(EarningRow);