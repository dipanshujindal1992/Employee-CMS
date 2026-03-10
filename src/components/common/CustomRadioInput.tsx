import React from "react";
import clsx from "clsx";

interface CustomRadioInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const CustomRadioInput = React.forwardRef<HTMLInputElement, CustomRadioInputProps>(
  (
    {
      label,
      error,
      className,
      helperText,
      ...props
    },
    ref,
  ) => {

  return (
    <div className={clsx("flex items-center gap-2", props.disabled && "opacity-50 cursor-not-allowed")}>
      <input
        ref={ref}
        type="radio"
        className={clsx(
          "cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-1",
          error
            ? "border-red-300 focus:ring-red-100"
            : "focus:ring-primary/20",
          className,
        )}
        {...props}
      />
      {label && (
        <label 
          className={clsx(
            "text-sm cursor-pointer transition-colors",
            error ? "text-red-500" : "text-slate-600 hover:text-slate-800"
          )}
          onClick={(e) => {
            if (props.disabled) {
              e.preventDefault();
              return;
            }
            // Trigger the radio input when label is clicked
            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
            if (input) input.click();
          }}
        >
          {label}
        </label>
      )}
      {helperText && !error && (
        <span className="text-xs text-slate-500 ml-2">{helperText}</span>
      )}
      {error && (
        <span className="text-xs text-red-500 ml-2 font-medium">{error}</span>
      )}
    </div>
  );
});

CustomRadioInput.displayName = "CustomRadioInput";

export default React.memo(CustomRadioInput);
