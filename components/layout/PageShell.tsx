import { Navbar } from "./Navbar";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";

interface PageShellProps {
  children: React.ReactNode;
  user?: { name: string; email: string } | null;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  description?: string;
  maxWidth?: "md" | "lg" | "xl" | "2xl" | "full";
  centered?: boolean;
}

const widths = {
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "max-w-full",
};

export function PageShell({
  children,
  user,
  breadcrumbs,
  title,
  description,
  maxWidth = "xl",
  centered = false,
}: PageShellProps) {
  return (
    <div className="app-gradient flex min-h-full flex-col">
      <Navbar user={user} />
      <main
        className={`mx-auto w-full flex-1 px-4 py-8 sm:px-6 sm:py-10 ${widths[maxWidth]} ${centered ? "flex flex-col items-center justify-center" : ""}`}
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb items={breadcrumbs} />
        )}
        {(title || description) && (
          <header className="mb-8">
            {title && (
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-2 max-w-2xl text-muted">{description}</p>
            )}
          </header>
        )}
        {children}
      </main>
    </div>
  );
}
