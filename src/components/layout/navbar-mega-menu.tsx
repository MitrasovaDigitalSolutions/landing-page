"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavbarAboutPanel } from "@/components/layout/navbar-about-panel";
import { NavbarProductsPanel } from "@/components/layout/navbar-products-panel";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import type { Service, ServiceType } from "@/types/api.types";

interface NavbarMegaMenuProps {
  navItems: NavItem[];
  serviceTypes: ServiceType[];
  services: Service[];
  isOverHero: boolean;
}

function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/") {
    return pathname === "/";
  }
  if (item.children && item.children.length > 0) {
    return item.children.some((child) => pathname.startsWith(child.href));
  }
  if (item.href === "/produk") {
    return pathname.startsWith("/produk") || pathname.startsWith("/services");
  }
  if (item.href === "/berita") {
    return pathname.startsWith("/berita") || pathname.startsWith("/articles");
  }
  return pathname.startsWith(item.href);
}

function getTriggerActiveClass(isActive: boolean, isOverHero: boolean): string {
  if (!isActive) {
    return "";
  }
  return isOverHero ? "bg-white/20 text-white" : "bg-primary/10 text-primary";
}

export function NavbarMegaMenu({
  navItems,
  serviceTypes,
  services,
  isOverHero,
}: NavbarMegaMenuProps): React.JSX.Element {
  const pathname = usePathname();
  const hasProducts = serviceTypes.length > 0 || services.length > 0;

  const linkSurfaceClass = isOverHero
    ? "bg-transparent text-white/90 hover:bg-white/15 hover:text-white focus:bg-white/15 focus:text-white data-active:bg-white/20 data-active:text-white data-active:hover:bg-white/25 data-active:focus:bg-white/20"
    : "bg-transparent text-slate-700 hover:bg-slate-100/90 hover:text-primary focus:bg-slate-100/90 focus:text-primary data-active:bg-primary/10 data-active:text-primary data-active:hover:bg-primary/12 data-active:focus:bg-primary/10";

  const triggerSurfaceClass = isOverHero
    ? "bg-transparent text-white/90 hover:bg-white/15 hover:text-white focus:bg-white/15 focus:text-white data-popup-open:bg-white/15 data-popup-open:text-white data-popup-open:hover:bg-white/20 data-open:bg-white/15 data-open:text-white data-open:hover:bg-white/20 data-open:focus:bg-white/15"
    : "bg-transparent text-slate-700 hover:bg-slate-100/90 hover:text-primary focus:bg-slate-100/90 focus:text-primary data-popup-open:bg-primary/10 data-popup-open:text-primary data-popup-open:hover:bg-primary/12 data-open:bg-primary/10 data-open:text-primary data-open:hover:bg-primary/12 data-open:focus:bg-primary/10";

  return (
    <NavigationMenu align="center" className="hidden lg:flex">
      <NavigationMenuList className="gap-1">
        {navItems.map((item) => {
          const isActive = isNavItemActive(pathname, item);

          if (item.children && item.children.length > 0) {
            return (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuTrigger
                  className={cn(
                    "h-9 rounded-full px-3.5 text-sm font-semibold",
                    triggerSurfaceClass,
                    getTriggerActiveClass(isActive, isOverHero)
                  )}
                >
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavbarAboutPanel items={item.children} />
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          if (item.href === "/produk" && hasProducts) {
            return (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuTrigger
                  className={cn(
                    "h-9 rounded-full px-3.5 text-sm font-semibold",
                    triggerSurfaceClass,
                    getTriggerActiveClass(isActive, isOverHero)
                  )}
                >
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavbarProductsPanel
                    serviceTypes={serviceTypes}
                    services={services}
                  />
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={item.href}>
              <NavigationMenuLink
                active={isActive}
                render={<Link href={item.href} />}
                className={cn(
                  "h-9 rounded-full px-3.5 text-sm font-semibold",
                  linkSurfaceClass
                )}
              >
                {item.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
