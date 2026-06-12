import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function Input({ label, id, hint, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s/g, "-");
  return (
    <label htmlFor={inputId} className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition-shadow placeholder:text-subtle focus:border-accent focus:ring-2 focus:ring-accent/20 ${className}`}
        {...props}
      />
      {hint && <span className="block text-xs text-subtle">{hint}</span>}
    </label>
  );
}
