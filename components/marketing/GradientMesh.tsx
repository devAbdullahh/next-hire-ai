interface GradientMeshProps {
  className?: string;
  children?: React.ReactNode;
}

export function GradientMesh({ className = "", children }: GradientMeshProps) {
  return (
    <div className={`gradient-mesh min-h-full w-full ${className}`}>
      <div className="gradient-orb gradient-orb-1" aria-hidden />
      <div className="gradient-orb gradient-orb-2" aria-hidden />
      <div className="gradient-orb gradient-orb-3" aria-hidden />
      {children}
    </div>
  );
}
