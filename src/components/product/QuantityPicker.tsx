"use client";

import { Minus, Plus } from "lucide-react";

interface QuantityPickerProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityPicker({
  quantity,
  onChange,
  min = 1,
  max = 99,
  className = "",
}: QuantityPickerProps) {
  return (
    <div className={`inline-flex items-center border border-border-default rounded-comfortable ${className}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className="flex items-center justify-center w-11 h-11 text-text-secondary hover:text-text-primary hover:bg-surface-subtle rounded-l-comfortable transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <span className="flex items-center justify-center w-12 h-11 text-[15px] font-semibold text-text-primary font-tabular border-x border-border-default">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="flex items-center justify-center w-11 h-11 text-text-secondary hover:text-text-primary hover:bg-surface-subtle rounded-r-comfortable transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
