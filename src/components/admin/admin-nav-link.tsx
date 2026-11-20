"use client";

import Link from "next/link";
import type { AdminNavItem } from "@/components/admin/admin-nav-config";
import { cn } from "@/lib/utils";

interface AdminNavLinkProps {
  item: AdminNavItem;
  active: boolean;
  rail: boolean;
  onNavigate?: () => void;
}

export function AdminNavLink({
  item,
  active,
  rail,
  onNavigate,
}: AdminNavLinkProps): React.JSX.Element {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={rail ? item.label : undefined}
      onClick={onNavigate}
      className={cn(
        "flex items-center rounded-lg text-xs font-semibold transition-colors",
        rail ? "justify-center p-2.5" : "gap-2.5 px-3 py-2",
        active
          ? "bg-primary text-primary-foreground shadow-2xs"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {rail ? null : <span className="truncate">{item.label}</span>}
    </Link>
  );
}
