"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

// === CONTEXT ===
const SelectContext = createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | undefined>(undefined);

// === SELECT ===
type SelectProps = {
  children: ReactNode;
  className?: string;
  value: string;
  onValueChange: (value: string) => void;
};

export const Select = ({ children, className = "", value, onValueChange }: SelectProps) => {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      <div className={`relative ${className}`}>{children}</div>
    </SelectContext.Provider>
  );
};

// === TRIGGER ===
export const SelectTrigger = ({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-center px-3 py-2 border rounded-md bg-white text-sm text-gray-700 shadow-sm ${className}`}
    >
      {children}
      <ChevronDown className="w-4 h-4 ml-2" />
    </button>
  );
};

// === CONTENT ===
export const SelectContent = ({
  children,
  isOpen,
  className,
}: {
  children: ReactNode;
  isOpen?: boolean;
  className?: string;
}) => {
  if (!isOpen) return null;
  return (
    <div className={`absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg ${className}`}>
      {children}
    </div>
  );
};

// === ITEM ===
export const SelectItem = ({
  value,
  children,
  className,
  closeDropdown,
}: {
  value: string;
  children: ReactNode;
  className?: string;
  closeDropdown: () => void;
}) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within <Select>");

  const handleClick = () => {
    context.onValueChange(value);
    closeDropdown(); // 👈 đóng dropdown khi chọn
  };

  return (
    <div
      onClick={handleClick}
      className={`px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${className || ""}`}
    >
      {children}
    </div>
  );
};

// === VALUE ===
export const SelectValue = ({ options }: { options: { value: string; label: string }[] }) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within <Select>");

  const selectedOption = options.find((opt) => opt.value === context.value);
  return <span>{selectedOption?.label || "Chọn..."}</span>;
};
