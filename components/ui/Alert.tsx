interface AlertProps {
  variant?: "error" | "success" | "info";
  children: React.ReactNode;
  className?: string;
}

const variants = {
  error: "border-danger/30 bg-danger-soft text-danger",
  success: "border-success/30 bg-success-soft text-success",
  info: "border-accent/30 bg-accent-soft text-accent",
};

export function Alert({ variant = "info", children, className = "" }: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-lg border px-4 py-3 text-sm ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
