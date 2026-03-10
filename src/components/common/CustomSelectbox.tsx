import React from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

interface Option {
    label: string;
    value: string | number;
}

interface CustomSelectboxProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options?: Option[];
    error?: string;
    fullWidth?: boolean;
    placeholder?: string;
    requiredIndicator?: boolean;
}

const CustomSelectbox: React.FC<CustomSelectboxProps> = ({
    label,
    options,
    error,
    className,
    fullWidth = false,
    placeholder = "Select",
    requiredIndicator = false,
    ...props
}) => {
    return (
        <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
            {label && (
                <label className="text-sm font-medium text-slate-700 mb-1.5 cursor-pointer">
                    {label}
                    {requiredIndicator && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    className={clsx(
                        "appearance-none w-full px-3 py-2 bg-white border rounded-md text-sm transition-all shadow-sm focus:outline-none focus:ring-1 pr-10",
                        error
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-slate-300 focus:border-primary focus:ring-primary",
                        className
                    )}
                    {...props}
                >
                    <option value="" disabled hidden>{placeholder}</option>
                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
        </div>
    );
};

export default React.memo(CustomSelectbox);
