"use client";

import { useState } from "react";
import { SidebarDesktop, SidebarMobile } from "./Sidebar";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { BrandLogo } from "@/components/layout/BrandLogo";

interface AppShellProps {
  user: { name: string; email: string };
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  description?: string;
}

export function AppShell({
  user,
  children,
  breadcrumbs,
  title,
  description,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-gradient min-h-screen w-full">
      <SidebarMobile
        user={user}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[16rem_1fr]">
        <SidebarDesktop user={user} />

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-[#181614ee] px-4 backdrop-blur-md sm:px-6 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-muted hover:bg-surface-muted"
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <BrandLogo href="/dashboard" />
          </header>

          <main className="w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
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
                  <p className="mt-2 max-w-3xl text-muted">{description}</p>
                )}
              </header>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
