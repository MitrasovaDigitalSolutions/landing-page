"use client";

import { useState } from "react";
import { Building2, ChevronDown, LogOut, Mail } from "lucide-react";
import { signOut } from "next-auth/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StatusBadge } from "@/components/ui/status-badge";
import { revokeAdminTokenAction } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";
import type { AdminSession } from "@/types/auth.types";

interface AdminUserMenuProps {
  session: AdminSession;
  siteName: string;
}

function getUserInitials(name?: string | null): string {
  const clean = (name ?? "AD").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || "AD";
}

export function AdminUserMenu({
  session,
  siteName,
}: AdminUserMenuProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = session.user.name ?? "Administrator";
  const initials = getUserInitials(session.user.name);

  const handleLogout = async (): Promise<void> => {
    setLoggingOut(true);
    await revokeAdminTokenAction();
    void signOut({ callbackUrl: "/login" });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              "flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white pr-2.5 pl-1.5 text-left transition-colors outline-none",
              "hover:border-slate-300 hover:bg-slate-50 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20",
              open && "border-primary ring-3 ring-primary/20"
            )}
          />
        }
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
          {initials}
        </span>
        <span className="hidden max-w-36 truncate text-xs font-semibold text-slate-800 sm:inline">
          {displayName}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 text-slate-400 transition-transform duration-150",
            open && "rotate-180 text-primary"
          )}
        />
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-2">
        <div className="space-y-2 rounded-lg bg-slate-50/80 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs font-bold text-slate-900">
              {displayName}
            </span>
            <StatusBadge
              status={session.user.isSuperadmin ? "superadmin" : "admin"}
              label={session.user.isSuperadmin ? "Superadmin" : "Admin"}
              showDot={false}
            />
          </div>

          {session.user.email ? (
            <p className="flex items-center gap-1.5 truncate text-[11px] text-slate-500">
              <Mail className="size-3 shrink-0 text-slate-400" />
              <span className="truncate">{session.user.email}</span>
            </p>
          ) : null}

          <p className="flex items-center gap-1.5 truncate text-[11px] font-medium text-slate-600">
            <Building2 className="size-3 shrink-0 text-primary" />
            <span className="truncate">{siteName}</span>
          </p>
        </div>

        <div className="my-1.5 border-t border-slate-100" />

        <button
          type="button"
          disabled={loggingOut}
          onClick={() => {
            void handleLogout();
          }}
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut className="size-3.5 shrink-0" />
          <span>{loggingOut ? "Sedang keluar..." : "Keluar"}</span>
        </button>
      </PopoverContent>
    </Popover>
  );
}
