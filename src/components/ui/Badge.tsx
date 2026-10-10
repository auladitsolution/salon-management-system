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
  | "warning"
  | "gold"
  | "purple";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  label?: string;
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ variant = "default", label, showDot = true, className, children, ...props }) => {
  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    pending: {
      container: "bg-amber-50 text-amber-700 border-amber-200/80 shadow-sm shadow-amber-500/10",
      dot: "bg-amber-500",
    },
    confirmed: {
      container: "bg-sky-50 text-sky-700 border-sky-200/80 shadow-sm shadow-sky-500/10",
      dot: "bg-sky-500",
    },
    checked_in: {
      container: "bg-purple-50 text-purple-700 border-purple-200/80 shadow-sm shadow-purple-500/10",
      dot: "bg-purple-500",
    },
    in_progress: {
      container: "bg-indigo-50 text-indigo-700 border-indigo-200/80 shadow-sm shadow-indigo-500/10 ring-1 ring-indigo-300/50",
      dot: "bg-indigo-500 animate-ping",
    },
    completed: {
      container: "bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-sm shadow-emerald-500/10",
      dot: "bg-emerald-500",
    },
    cancelled: {
      container: "bg-rose-50 text-rose-700 border-rose-200/80 shadow-sm shadow-rose-500/10",
      dot: "bg-rose-500",
    },
    no_show: {
      container: "bg-slate-100 text-slate-700 border-slate-200/80",
      dot: "bg-slate-400",
    },
    paid: {
      container: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold",
      dot: "bg-emerald-500",
    },
    unpaid: {
      container: "bg-rose-50 text-rose-700 border-rose-200/80 font-bold",
      dot: "bg-rose-500",
    },
    partially_paid: {
      container: "bg-amber-50 text-amber-700 border-amber-200/80 font-bold",
      dot: "bg-amber-500",
    },
    default: {
      container: "bg-salon-primary-50 text-salon-primary border-salon-primary-200/80 shadow-sm",
      dot: "bg-salon-primary",
    },
    success: {
      container: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      dot: "bg-emerald-500",
    },
    danger: {
      container: "bg-rose-50 text-rose-700 border-rose-200/80",
      dot: "bg-rose-500",
    },
    warning: {
      container: "bg-amber-50 text-amber-700 border-amber-200/80",
      dot: "bg-amber-500",
    },
    gold: {
      container: "bg-yellow-50 text-amber-800 border-yellow-300 font-bold shadow-sm shadow-amber-500/10",
      dot: "bg-amber-500",
    },
    purple: {
      container: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 shadow-sm shadow-fuchsia-500/10",
      dot: "bg-fuchsia-500",
    },
  };

  const styleConfig = variantStyles[variant] || variantStyles.default;

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
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all",
          styleConfig.container,
          className
        )
      )}
      {...props}
    >
      {showDot && (
        <span className={clsx("w-1.5 h-1.5 rounded-full shrink-0", styleConfig.dot)} />
      )}
      <span>{text}</span>
    </span>
  );
};

