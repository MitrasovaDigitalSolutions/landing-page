"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { NavbarBrand } from "@/components/layout/navbar-brand";
import { NavbarMegaMenu } from "@/components/layout/navbar-mega-menu";
import { NavbarMobile } from "@/components/layout/navbar-mobile";
import { Button } from "@/components/ui/button";
import type { NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import type { Service, ServiceType } from "@/types/api.types";
import type { SiteConfig } from "@/types/site.types";
import type { SiteSettings } from "@/types/site-settings.types";

interface SiteNavbarProps {
  config: SiteConfig;
  settings: SiteSettings;
  navItems: NavItem[];
  contactHref?: string;
  serviceTypes?: ServiceType[];
  services?: Service[];
}

function subscribeScroll(onStoreChange: () => void): () => void {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => {
    window.removeEventListener("scroll", onStoreChange);
  };
}

function getScrollSnapshot(): boolean {
  return window.scrollY > 24;
}

function getServerScrollSnapshot(): boolean {
  return false;
}

function getHeaderClassName(isHome: boolean, isScrolled: boolean): string {
  if (isHome) {
    return cn(
      "fixed inset-x-0 top-0 z-40 w-full transition-all duration-300",
      isScrolled
        ? "px-3 pt-3 sm:px-6"
        : "bg-gradient-to-b from-slate-950/65 via-slate-950/25 to-transparent"
    );
  }
  return cn(
    "sticky top-0 z-40 flex h-[76px] w-full items-center transition-all duration-300",
    isScrolled
      ? "px-3 sm:px-6"
      : "border-b border-slate-200/80 bg-white/95 backdrop-blur-md"
  );
}

export function SiteNavbar({
  config,
  settings,
  navItems,
  contactHref = "/kontak",
  serviceTypes = [],
  services = [],
}: SiteNavbarProps): React.JSX.Element {
  const pathname = usePathname();
  const isScrolled = useSyncExternalStore(
    subscribeScroll,
    getScrollSnapshot,
    getServerScrollSnapshot
  );

  const isHome = pathname === "/";
  const isOverHero = isHome && !isScrolled;
  const siteTitle = settings.general?.site_title ?? config.name;
  const tagline = settings.general?.tagline;
  const waDigits = settings.contact?.whatsapp?.replaceAll(/\D/g, "");

  return (
    <header className={getHeaderClassName(isHome, isScrolled)}>
      <div
        className={cn(
          "mx-auto flex w-full items-center justify-between gap-4 transition-all duration-300",
          isScrolled
            ? "h-16 max-w-6xl rounded-2xl border border-slate-200/80 bg-white/88 px-4 shadow-lg shadow-slate-900/[0.06] backdrop-blur-xl sm:px-6"
            : "h-[72px] max-w-7xl px-4 sm:px-6 lg:px-8"
        )}
      >
        <NavbarBrand
          siteTitle={siteTitle}
          tagline={tagline}
          logoUrl={settings.general?.logo_url}
          logoPath={settings.general?.logo_path}
          isOverHero={isOverHero}
          isScrolled={isScrolled}
        />

        <NavbarMegaMenu
          navItems={navItems}
          serviceTypes={serviceTypes}
          services={services}
          isOverHero={isOverHero}
        />

        <div className="hidden items-center gap-2 lg:flex">
          {waDigits ? (
            <Button
              variant="outline"
              size="icon-sm"
              nativeButton={false}
              aria-label="Chat WhatsApp"
              className={cn(
                "size-9 rounded-full transition-colors",
                isOverHero
                  ? "border-white/25 bg-white/10 text-white backdrop-blur-xs hover:bg-white/20 hover:text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary/40 hover:text-primary"
              )}
              render={
                <a
                  href={`https://wa.me/${waDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <MessageCircle className="size-4" />
            </Button>
          ) : null}

          <Button
            size="sm"
            nativeButton={false}
            className="h-9 gap-1.5 rounded-full px-4 text-xs font-bold shadow-xs"
            render={<Link href={contactHref} />}
          >
            <span>Hubungi Kami</span>
            <ArrowUpRight className="size-3.5" />
          </Button>
        </div>

        <NavbarMobile
          siteTitle={siteTitle}
          tagline={tagline}
          logoUrl={settings.general?.logo_url}
          logoPath={settings.general?.logo_path}
          navItems={navItems}
          serviceTypes={serviceTypes}
          services={services}
          contact={settings.contact}
          contactHref={contactHref}
          isOverHero={isOverHero}
        />
      </div>
    </header>
  );
}
