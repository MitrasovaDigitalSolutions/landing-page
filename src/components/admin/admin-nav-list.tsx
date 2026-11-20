"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { AdminNavLink } from "@/components/admin/admin-nav-link";
import {
  getAdminNavGroups,
  isNavItemActive,
} from "@/components/admin/admin-nav-config";
import { cn } from "@/lib/utils";

interface AdminNavListProps {
  isSuperadmin: boolean;
  rail?: boolean;
  onNavigate?: () => void;
}

export function AdminNavList({
  isSuperadmin,
  rail = false,
  onNavigate,
}: AdminNavListProps): React.JSX.Element {
  const pathname = usePathname();
  const groups = getAdminNavGroups(isSuperadmin);
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  return (
    <nav className={cn("p-2.5", rail ? "space-y-1" : "space-y-2")}>
      {groups.map((group, groupIdx) => {
        const hasActive = group.items.some((item) =>
          isNavItemActive(pathname, item.href)
        );
        const isOpen = group.label === null || (overrides[group.key] ?? hasActive);
        const showItems = rail || isOpen;

        return (
          <div
            key={group.key}
            className={cn(
              rail && groupIdx > 0 && "border-t border-slate-100 pt-1"
            )}
          >
            {group.label !== null && !rail ? (
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => {
                  setOverrides((prev) => ({
                    ...prev,
                    [group.key]: !(prev[group.key] ?? hasActive),
                  }));
                }}
                className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase transition-colors hover:text-slate-600"
              >
                <span>{group.label}</span>
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-150",
                    !isOpen && "-rotate-90"
                  )}
                />
              </button>
            ) : null}

            {showItems ? (
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <AdminNavLink
                    key={item.href}
                    item={item}
                    rail={rail}
                    active={isNavItemActive(pathname, item.href)}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
