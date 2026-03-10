import React from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { motion, type HTMLMotionProps } from "framer-motion";

// Extend HTMLMotionProps to support animation props
interface CustomButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "none";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  children?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  label,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = `
  inline-flex items-center  rounded-lg font-semibold
  transition-all focus:outline-none
  ${variant === "none" ? "" : "focus:ring-2"}
  focus:ring-offset-1
  disabled:opacity-50 disabled:cursor-not-allowed
  transform active:scale-95
`;

  const variants = {
    primary:
      "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:to-blue-600 border border-transparent",
    secondary:
      "bg-gradient-to-r from-secondary to-cyan-500 text-white shadow-lg shadow-secondary/30 hover:shadow-secondary/50 border border-transparent",
    outline:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100/50 hover:text-slate-900",
    none: "",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {label ? label : (children as React.ReactNode)}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
};

export default React.memo(CustomButton);
