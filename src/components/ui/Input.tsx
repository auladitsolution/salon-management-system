import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-salon-dark">
            {label}
          </label>
        )}
        <div className="relative rounded-2xl">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-salon-muted">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={twMerge(
              clsx(
                "w-full rounded-2xl border bg-white/90 px-4 py-2.5 text-sm text-salon-dark placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-rose-500/15 focus:border-rose-500 disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm",
                leftIcon && "pl-11",
                error
                  ? "border-rose-400 focus:ring-rose-400/20 focus:border-rose-600"
                  : "border-rose-200/70 hover:border-rose-300",
                className
              )
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-salon-muted">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

