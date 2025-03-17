"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TimePickerInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimePickerInput({ value, onChange, className }: TimePickerInputProps) {
  const [hours, minutes] = value.split(':').map(Number);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newValue)) {
      onChange(newValue);
    }
  };
  
  return (
    <Input
      type="time"
      value={value}
      onChange={handleChange}
      className={className}
    />
  );
} 