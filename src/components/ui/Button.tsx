import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantStyles = {
      primary:
        "bg-salon-primary hover:bg-salon-primary-700 text-white shadow-md shadow-salon-primary/20 focus:ring-salon-primary",
      secondary:
        "bg-salon-secondary hover:bg-salon-secondary-dark text-salon-dark shadow-sm focus:ring-salon-secondary",
      outline:
        "border border-salon-primary/30 text-salon-primary hover:bg-salon-primary-50 focus:ring-salon-primary",
      ghost:
        "text-salon-dark hover:bg-salon-primary-100/50 focus:ring-salon-primary",
      danger:
        "bg-salon-danger hover:bg-red-700 text-white shadow-md shadow-red-500/20 focus:ring-salon-danger",
      gold:
        "bg-salon-accent hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 focus:ring-salon-accent",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3 gap-2.5 font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variantStyles[variant], sizeStyles[size], className))}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
