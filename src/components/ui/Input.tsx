"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full bg-surface-input border rounded-comfortable
            px-4 py-3 text-[14px] text-text-primary
            placeholder:text-text-muted
            transition-all duration-150
            focus-ring
            ${error ? "border-error" : "border-border-default"}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-[12px] text-error">{error}</p>
        )}
        {hint && !error && (
          <p className="text-[12px] text-text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, type InputProps };
