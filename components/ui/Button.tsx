import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants = {
  primary:
    "bg-accent text-white shadow-sm hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50",
  secondary:
    "border border-border-strong bg-surface text-foreground hover:bg-surface-muted active:scale-[0.98]",
  ghost:
    "text-muted hover:bg-surface-muted hover:text-foreground",
  danger:
    "bg-danger-soft text-danger border border-danger/20 hover:bg-danger/10",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-[10px]",
  lg: "px-6 py-3 text-base rounded-[10px]",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      )}
      {loading ? "Please wait…" : children}
    </button>
  );
}
