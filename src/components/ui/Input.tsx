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
          <label htmlFor={inputId} className="block text-sm font-medium text-salon-dark">
            {label}
          </label>
        )}
        <div className="relative rounded-xl">
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
                "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-salon-dark placeholder:text-salon-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-salon-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed",
                leftIcon && "pl-10",
                error
                  ? "border-salon-danger focus:ring-salon-danger"
                  : "border-salon-primary/20 hover:border-salon-primary/40",
                className
              )
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-salon-danger font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-salon-muted">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
