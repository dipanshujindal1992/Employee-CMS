import React from "react";
import clsx from "clsx";

interface CustomCheckboxProps {
    label: string;
    checked: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    disabled?: boolean;
    className?: string;
    labelClassName?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    label,
    checked,
    onChange,
    name,
    disabled = false,
    className = "",
    labelClassName = "",
}) => {
    return (
        <label className={clsx("flex items-center gap-2 cursor-pointer transition-all", disabled && "opacity-50 cursor-not-allowed", className)}>
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-slate-300 transition-all cursor-pointer disabled:cursor-not-allowed"
            />
            <span className={clsx("text-sm text-slate-700 font-medium", labelClassName)}>
                {label}
            </span>
        </label>
    );
};

export default React.memo(CustomCheckbox);
