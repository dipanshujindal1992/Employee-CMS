import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  requiredIndicator?: boolean;
  maxLength?: number;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      error,
      className,
      fullWidth = false,
      helperText,
      requiredIndicator = false,
      maxLength = 80,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={clsx("flex flex-col group", fullWidth && "w-full")}>
        {label && (
          <label className="text-sm font-semibold text-slate-600 mb-1.5 cursor-pointer group-focus-within:text-primary transition-colors">
            {label}
            {requiredIndicator && (
              <span className="text-red-500 ml-0.5">*</span>
            )}
          </label>
        )}

        <motion.div whileTap={{ scale: 0.995 }}>
          <input
            ref={ref}
            maxLength={maxLength}
            className={clsx(
              "px-4 py-2.5 bg-white border rounded-xl text-sm transition-all shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 w-full",
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-primary/50 focus:ring-primary/10 hover:border-slate-300",
              className,
            )}
            {...props}
          />
        </motion.div>

        {helperText && !error && (
          <span className="text-xs text-slate-500 mt-1.5">{helperText}</span>
        )}
        {error && (
          <span className="text-xs text-red-500 mt-1.5 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  },
);

CustomInput.displayName = "CustomInput";

export default React.memo(CustomInput);