"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NavbarMobileFooter } from "@/components/layout/navbar-mobile-footer";
import { NavbarMobileGroup } from "@/components/layout/navbar-mobile-group";
import { NavbarMobileProducts } from "@/components/layout/navbar-mobile-products";
import { SmartImage } from "@/components/shared/smart-image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import type { Service, ServiceType } from "@/types/api.types";
import type { SiteContactSettings } from "@/types/site-settings.types";

interface NavbarMobileProps {
  siteTitle: string;
  tagline?: string;
  logoUrl?: string | null;
  logoPath?: string | null;
  navItems: NavItem[];
  serviceTypes: ServiceType[];
  services: Service[];
  contact?: SiteContactSettings;
  contactHref?: string | null;
  isOverHero: boolean;
}

function getInitials(title: string): string {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function NavbarMobile({
  siteTitle,
  tagline,
  logoUrl,
  logoPath,
  navItems,
  serviceTypes,
  services,
  contact,
  contactHref = "/kontak",
  isOverHero,
}: NavbarMobileProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = (): void => {
    setIsOpen(false);
  };

  const initials = getInitials(siteTitle);
  const hasLogo = Boolean(logoUrl ?? logoPath);
  const hasProducts = serviceTypes.length > 0 || services.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "size-9 rounded-xl transition-colors lg:hidden",
              isOverHero
                ? "border-white/25 bg-white/10 text-white backdrop-blur-xs hover:bg-white/20 hover:text-white"
                : "border-slate-200 bg-white text-slate-700"
            )}
            aria-label="Buka menu navigasi"
          />
        }
      >
        <Menu className="size-4" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-[85vw] max-w-sm flex-col gap-0 border-l border-slate-200 p-0"
      >
        <SheetHeader className="flex-row items-center gap-3 border-b border-slate-100 p-5 pr-12 text-left">
          {hasLogo ? (
            <div className="relative size-9 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white p-1">
              <SmartImage
                src={logoUrl}
                fallbackPath={logoPath}
                alt={siteTitle}
                fill
                sizes="36px"
                className="object-contain"
                fallbackClassName="bg-primary text-xs font-extrabold text-white"
                fallback={<span>{initials}</span>}
              />
            </div>
          ) : (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-extrabold text-white">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <SheetTitle className="truncate text-sm font-bold text-slate-900">
              {siteTitle}
            </SheetTitle>
            {tagline ? (
              <p className="truncate text-[11px] text-slate-500">{tagline}</p>
            ) : null}
          </div>
        </SheetHeader>

        <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-5">
          {navItems.map((item) => {
            if (item.children && item.children.length > 0) {
              return (
                <NavbarMobileGroup
                  key={item.label}
                  label={item.label}
                  items={item.children}
                  onNavigate={closeMenu}
                />
              );
            }

            if (item.href === "/produk" && hasProducts) {
              return (
                <NavbarMobileProducts
                  key={item.href}
                  serviceTypes={serviceTypes}
                  services={services}
                  onNavigate={closeMenu}
                />
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <NavbarMobileFooter
          contact={contact}
          contactHref={contactHref}
          onNavigate={closeMenu}
        />
      </SheetContent>
    </Sheet>
  );
}
