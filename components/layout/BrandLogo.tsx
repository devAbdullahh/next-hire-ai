import Link from "next/link";
import { PlasmaWaveMark } from "@/components/layout/PlasmaWaveMark";
import { APP_NAME } from "@/lib/constants";
import { APP_LOGO_FONT_VARIATION, bitcountSingle } from "@/lib/fonts";

interface BrandLogoProps {
  href?: string;
  className?: string;
  onClick?: () => void;
}

export function BrandLogo({ href = "/", className = "", onClick }: BrandLogoProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label={APP_NAME}
    >
      <PlasmaWaveMark />
      <span
        className={`${bitcountSingle.className} text-lg leading-none tracking-tight text-foreground transition-colors group-hover:text-accent`}
        style={{ fontVariationSettings: APP_LOGO_FONT_VARIATION }}
      >
        {APP_NAME}
      </span>
    </Link>
  );
}
