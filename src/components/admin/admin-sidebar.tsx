"use client";

import { Scrollable } from "@/components/ui/scrollable";
import { AdminNavList } from "@/components/admin/admin-nav-list";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import { ChevronsLeft, ChevronsRight, Landmark } from "lucide-react";

interface AdminSidebarProps {
  isSuperadmin?: boolean;
}

export function AdminSidebar({
  isSuperadmin = false,
}: AdminSidebarProps): React.JSX.Element {
  const { isCollapsed, toggle } = useSidebarStore();

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-slate-200 bg-white text-slate-700 transition-all duration-200 lg:flex",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b border-slate-100",
          isCollapsed ? "justify-center px-2" : "gap-2.5 px-4"
        )}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-2xs">
          <Landmark className="size-4" />
        </div>
        {!isCollapsed ? (
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-bold tracking-tight text-slate-900">
              Mitrasova CMS
            </span>
            <span className="truncate text-[10px] font-medium text-slate-500">
              Enterprise Console
            </span>
          </div>
        ) : null}
      </div>

      <Scrollable className="min-h-0 flex-1">
        <AdminNavList isSuperadmin={isSuperadmin} rail={isCollapsed} />
      </Scrollable>

      <div className="border-t border-slate-100 p-2">
        <button
          type="button"
          onClick={toggle}
          className={cn(
            "flex w-full items-center rounded-lg py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900",
            isCollapsed ? "justify-center px-2" : "gap-2 px-3"
          )}
          title={isCollapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
        >
          {isCollapsed ? (
            <ChevronsRight className="size-4 shrink-0" />
          ) : (
            <ChevronsLeft className="size-4 shrink-0" />
          )}
          {!isCollapsed ? <span>Ciutkan Menu</span> : null}
        </button>
      </div>
    </aside>
  );
}
