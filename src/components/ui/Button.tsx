import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold" | "gradient" | "emerald";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-salon-primary-700 via-salon-primary to-fuchsia-700 hover:from-salon-primary hover:to-fuchsia-600 text-white shadow-lg shadow-salon-primary/30 hover:shadow-glow hover:-translate-y-0.5 focus:ring-salon-primary",
      secondary:
        "bg-gradient-to-r from-amber-100 to-rose-100 hover:from-amber-200 hover:to-rose-200 text-salon-dark border border-amber-200/60 shadow-sm hover:shadow hover:-translate-y-0.5 focus:ring-salon-secondary",
      gradient:
        "bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-glow-purple hover:-translate-y-0.5 focus:ring-purple-500",
      gold:
        "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold shadow-lg shadow-amber-500/30 hover:shadow-glow-gold hover:-translate-y-0.5 focus:ring-amber-500",
      emerald:
        "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 hover:shadow-glow-emerald hover:-translate-y-0.5 focus:ring-emerald-500",
      outline:
        "border-2 border-salon-primary/40 text-salon-primary hover:bg-salon-primary-50/80 hover:border-salon-primary focus:ring-salon-primary hover:-translate-y-0.5",
      ghost:
        "text-salon-dark hover:bg-salon-primary-100/60 hover:text-salon-primary focus:ring-salon-primary",
      danger:
        "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-md shadow-red-500/25 focus:ring-rose-500 hover:-translate-y-0.5",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-base px-7 py-3.5 gap-2.5 font-bold tracking-wide",
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

