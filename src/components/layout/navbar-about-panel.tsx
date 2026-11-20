"use client";

import {
  ArrowUpRight,
  Briefcase,
  Building2,
  FileText,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import type { NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface NavbarAboutPanelProps {
  items: NavItem[];
}

export function NavbarAboutPanel({
  items,
}: NavbarAboutPanelProps): React.JSX.Element {
  const isTwoCol = items.length > 4;

  return (
    <div
      className={cn(
        "gap-1 p-2.5",
        isTwoCol ? "grid w-[520px] grid-cols-2" : "flex w-[340px] flex-col"
      )}
    >
      {items.map((item) => (
        <NavigationMenuLink
          key={item.href}
          closeOnClick
          render={<Link href={item.href} />}
          className="group flex items-start gap-3 rounded-xl p-2.5 hover:bg-slate-100/90"
        >
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/8 text-primary">
            {item.href === "/profil" ? <Building2 className="size-4" /> : null}
            {item.href === "/cabang" ? <MapPin className="size-4" /> : null}
            {item.href === "/unit-usaha" ? (
              <Briefcase className="size-4" />
            ) : null}
            {item.href === "/karir" ? <Users className="size-4" /> : null}
            {item.href !== "/profil" &&
            item.href !== "/cabang" &&
            item.href !== "/unit-usaha" &&
            item.href !== "/karir" ? (
              <FileText className="size-4" />
            ) : null}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-primary">
              <span>{item.label}</span>
              <ArrowUpRight className="size-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
            </span>
            {item.description ? (
              <span className="mt-0.5 line-clamp-2 block text-[11px] leading-snug text-slate-500">
                {item.description}
              </span>
            ) : null}
          </span>
        </NavigationMenuLink>
      ))}
    </div>
  );
}
