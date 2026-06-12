interface BadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "muted" | "success" | "outline";
  className?: string;
}

const variants = {
  accent: "bg-accent-soft text-accent border-accent/20",
  muted: "bg-surface-muted text-muted border-border",
  success: "bg-success-soft text-success border-success/20",
  outline: "bg-transparent text-muted border-border",
};

export function Badge({
  children,
  variant = "accent",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
