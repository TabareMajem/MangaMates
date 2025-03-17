"use client";

import { forwardRef } from "react";
import { cn } from "../../lib/utils";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: Option[];
  onValueChange: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  options,
  onValueChange,
  value,
  ...props
}, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-10 w-full rounded-md border border-input bg-background px-3 py-2",
      "text-sm ring-offset-background focus:outline-none focus:ring-2",
      "focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    {...props}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
));
Select.displayName = "Select";
