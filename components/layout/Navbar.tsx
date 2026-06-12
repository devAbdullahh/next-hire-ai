import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { BrandLogo } from "@/components/layout/BrandLogo";

interface NavbarProps {
  user?: { name: string; email: string } | null;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#181614ee] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <BrandLogo href={user ? "/dashboard" : "/"} />

        <nav className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="size-8 rounded-full bg-accent-soft flex items-center justify-center text-xs font-semibold text-accent">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[140px] truncate text-sm text-muted">
                  {user.name}
                </span>
              </div>
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">
                  Dashboard
                </Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
