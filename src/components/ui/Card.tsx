import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, glass = false, children, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-2xl border border-salon-primary/10 p-6 shadow-sm transition-all duration-200",
          glass
            ? "bg-white/80 backdrop-blur-md border-white/40 shadow-lg shadow-salon-primary/5"
            : "bg-white",
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
  <div className={twMerge(clsx("mb-4 flex flex-col space-y-1.5", className))} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h3 className={twMerge(clsx("text-lg font-semibold text-salon-dark tracking-tight", className))} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => (
  <p className={twMerge(clsx("text-sm text-salon-muted", className))} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={twMerge(clsx("space-y-4", className))} {...props}>
    {children}
  </div>
);
