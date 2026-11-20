"use client";

import Link from "next/link";
import { SmartImage } from "@/components/shared/smart-image";
import { cn } from "@/lib/utils";

interface NavbarBrandProps {
  siteTitle: string;
  tagline?: string;
  logoUrl?: string | null;
  logoPath?: string | null;
  isOverHero: boolean;
  isScrolled: boolean;
}

function getInitials(title: string): string {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function NavbarBrand({
  siteTitle,
  tagline,
  logoUrl,
  logoPath,
  isOverHero,
  isScrolled,
}: NavbarBrandProps): React.JSX.Element {
  const initials = getInitials(siteTitle);
  const hasLogo = Boolean(logoUrl ?? logoPath);

  return (
    <Link
      href="/"
      className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
    >
      {hasLogo ? (
        <div
          className={cn(
            "relative size-9 shrink-0 overflow-hidden rounded-xl p-1 transition-all sm:size-10",
            isOverHero
              ? "border border-white/30 bg-white/95 shadow-xs"
              : "border border-slate-200/80 bg-white"
          )}
        >
          <SmartImage
            src={logoUrl}
            fallbackPath={logoPath}
            alt={siteTitle}
            fill
            sizes="40px"
            className="object-contain"
            fallbackClassName="bg-primary text-xs font-extrabold text-white"
            fallback={<span>{initials}</span>}
          />
        </div>
      ) : (
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold transition-colors sm:size-10 sm:text-sm",
            isOverHero
              ? "border border-white/25 bg-white/15 text-white backdrop-blur-xs"
              : "bg-primary text-white"
          )}
        >
          {initials}
        </div>
      )}

      <div className="min-w-0">
        <span
          className={cn(
            "block truncate text-sm font-bold tracking-tight transition-colors sm:text-base",
            isOverHero ? "text-white" : "text-slate-900"
          )}
        >
          {siteTitle}
        </span>
        {tagline && !isScrolled ? (
          <span
            className={cn(
              "hidden truncate text-[11px] font-medium transition-colors sm:block",
              isOverHero ? "text-white/75" : "text-slate-500"
            )}
          >
            {tagline}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
