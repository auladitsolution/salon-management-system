import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, glass = false, hoverEffect = false, children, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-3xl border transition-all duration-300 relative",
          glass
            ? "bg-white/85 backdrop-blur-xl border-white/60 shadow-xl shadow-rose-950/5"
            : "bg-white border-rose-100/70 shadow-sm shadow-rose-950/5",
          hoverEffect && "hover:shadow-xl hover:shadow-rose-900/10 hover:-translate-y-1 hover:border-rose-300/80",
          "p-6",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={twMerge(clsx("mb-5 flex flex-col space-y-1.5", className))} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h3 className={twMerge(clsx("text-lg font-bold text-salon-dark tracking-tight", className))} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => (
  <p className={twMerge(clsx("text-sm text-salon-muted leading-relaxed", className))} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={twMerge(clsx("space-y-4", className))} {...props}>
    {children}
  </div>
);

