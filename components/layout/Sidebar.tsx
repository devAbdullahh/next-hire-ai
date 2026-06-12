"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { BrandLogo } from "@/components/layout/BrandLogo";

export const appNavItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/target-roles",
    label: "Target roles",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <path d="M12 12v4M10 14h4" />
      </svg>
    ),
  },
  {
    href: "/resumes",
    label: "Resumes",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
  {
    href: "/avatars",
    label: "Avatars",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    href: "/interviews",
    label: "Interviews",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
] as const;

interface SidebarProps {
  user: { name: string; email: string };
  mobileOpen?: boolean;
  onClose?: () => void;
}

function SidebarContent({
  user,
  onNavigate,
}: {
  user: { name: string; email: string };
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
        <BrandLogo href="/dashboard" onClick={onNavigate} />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3 custom-scrollbar">
        {appNavItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href === "/interviews" &&
              (pathname.startsWith("/interviews") || pathname.startsWith("/interview"))) ||
            (item.href !== "/dashboard" &&
              item.href !== "/interviews" &&
              pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-accent-soft text-accent"
                  : "text-muted hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              <span className={active ? "text-accent" : "text-subtle"}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3 rounded-[10px] bg-surface-muted px-3 py-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-subtle">{user.email}</p>
          </div>
        </div>
        <LogoutButton className="w-full justify-center" />
      </div>
    </>
  );
}

/** Desktop sidebar — lives in grid column, sticky */
export function SidebarDesktop({ user }: { user: { name: string; email: string } }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-[#181614] lg:flex">
      <SidebarContent user={user} />
    </aside>
  );
}

/** Mobile drawer — fixed overlay */
export function SidebarMobile({
  user,
  open,
  onClose,
}: {
  user: { name: string; email: string };
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col border-r border-border bg-[#181614] transition-transform lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent user={user} onNavigate={onClose} />
      </aside>
    </>
  );
}

/** @deprecated Use SidebarDesktop + SidebarMobile */
export function Sidebar({ user, mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <SidebarDesktop user={user} />
      <SidebarMobile user={user} open={!!mobileOpen} onClose={onClose ?? (() => {})} />
    </>
  );
}
