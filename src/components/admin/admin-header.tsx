"use client";

import { ExternalLink, Menu } from "lucide-react";
import Link from "next/link";
import { AdminNavList } from "@/components/admin/admin-nav-list";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { Button } from "@/components/ui/button";
import { Scrollable } from "@/components/ui/scrollable";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSidebarStore } from "@/stores/sidebar-store";
import type { AdminSession } from "@/types/auth.types";

interface AdminHeaderProps {
  session: AdminSession;
  siteName: string;
}

export function AdminHeader({
  session,
  siteName,
}: AdminHeaderProps): React.JSX.Element {
  const { isMobileOpen, setMobileOpen } = useSidebarStore();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center">
        <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                className="rounded-lg border-slate-200 lg:hidden"
                aria-label="Menu Admin"
              />
            }
          >
            <Menu className="size-4" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex w-60 flex-col bg-white p-4 text-slate-800"
          >
            <SheetHeader className="border-b border-slate-100 pb-3 text-left">
              <SheetTitle className="text-sm font-bold text-slate-900">
                Mitrasova CMS
              </SheetTitle>
            </SheetHeader>
            <Scrollable className="mt-3 min-h-0 flex-1">
              <AdminNavList
                isSuperadmin={Boolean(session.user.isSuperadmin)}
                onNavigate={() => {
                  setMobileOpen(false);
                }}
              />
            </Scrollable>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          target="_blank"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-primary"
        >
          <span className="hidden sm:inline">Lihat Situs</span>
          <ExternalLink className="size-3.5" />
        </Link>

        <AdminUserMenu session={session} siteName={siteName} />
      </div>
    </header>
  );
}
