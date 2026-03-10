import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface CustomTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  requiredIndicator?: boolean;
  rows?: number;
}

const CustomTextArea = React.forwardRef<HTMLTextAreaElement, CustomTextAreaProps>(
  (
    {
      label,
      error,
      className,
      fullWidth = false,
      helperText,
      requiredIndicator = false,
      rows = 4,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={clsx("flex flex-col group", fullWidth && "w-full")}>
        {label && (
          <label className="text-sm font-semibold text-slate-600 mb-1.5 cursor-pointer group-focus-within:text-primary transition-colors">
            {label}
            {requiredIndicator && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <motion.div whileTap={{ scale: 0.995 }}>
          <textarea
            ref={ref}
            rows={rows}
            className={clsx(
              "px-4 py-2.5 bg-white border rounded-xl text-sm transition-all shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 w-full resize-y",
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
          <span className="text-xs text-red-500 mt-1.5 font-medium">{error}</span>
        )}
      </div>
    );
  }
);

CustomTextArea.displayName = "CustomTextArea";

export default React.memo(CustomTextArea);
