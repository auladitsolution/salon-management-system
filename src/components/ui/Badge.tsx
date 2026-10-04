import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { bn } from "@/i18n/bn";

export type BadgeVariant =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show"
  | "paid"
  | "unpaid"
  | "partially_paid"
  | "default"
  | "success"
  | "danger"
  | "warning";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  label?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = "default", label, className, children, ...props }) => {
  const variantStyles: Record<BadgeVariant, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-300",
    confirmed: "bg-blue-100 text-blue-800 border-blue-300",
    checked_in: "bg-purple-100 text-purple-800 border-purple-300",
    in_progress: "bg-indigo-100 text-indigo-800 border-indigo-300 animate-pulse",
    completed: "bg-emerald-100 text-emerald-800 border-emerald-300",
    cancelled: "bg-rose-100 text-rose-800 border-rose-300",
    no_show: "bg-gray-100 text-gray-800 border-gray-300",
    paid: "bg-emerald-100 text-emerald-800 border-emerald-300",
    unpaid: "bg-rose-100 text-rose-800 border-rose-300",
    partially_paid: "bg-amber-100 text-amber-800 border-amber-300",
    default: "bg-salon-primary-100 text-salon-primary-800 border-salon-primary-200",
    success: "bg-emerald-100 text-emerald-800 border-emerald-300",
    danger: "bg-rose-100 text-rose-800 border-rose-300",
    warning: "bg-amber-100 text-amber-800 border-amber-300",
  };

  // Automatic Bengali label mapping for status badges if label not provided
  let text = label || children;
  if (!text) {
    if (variant in bn.appointmentStatus) {
      text = bn.appointmentStatus[variant as keyof typeof bn.appointmentStatus];
    } else if (variant in bn.payment.status) {
      text = bn.payment.status[variant as keyof typeof bn.payment.status];
    }
  }

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {text}
    </span>
  );
};
