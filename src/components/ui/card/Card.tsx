import React from "react";
import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className = "" }: CardProps) => (
  <div className={`rounded-2xl border bg-white p-4 shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = "" }: CardProps) => (
  <div className={`mb-2 font-semibold text-lg ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = "" }: CardProps) => (
  <div className={`text-gray-700 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = "" }: CardProps) => (
  <div className={`mt-4 border-t pt-2 text-sm text-gray-500 ${className}`}>
    {children}
  </div>
);
