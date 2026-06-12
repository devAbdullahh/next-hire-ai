import { Navbar } from "@/components/layout/Navbar";
import { AuthBrandPanel } from "./AuthBrandPanel";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="app-gradient flex min-h-dvh flex-col">
      <Navbar />
      <main className="grid min-h-0 flex-1 lg:grid-cols-2 lg:overflow-hidden">
        <AuthBrandPanel />

        <div className="flex items-center justify-center px-4 py-10 sm:px-8 lg:py-12">
          <div className="w-full max-w-md animate-in animate-in-delay-2">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
