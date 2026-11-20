"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NavbarAdminLinkProps {
  isOverHero: boolean;
}

function hasAuthenticatedUser(data: unknown): boolean {
  if (typeof data !== "object" || data === null || !("user" in data)) {
    return false;
  }
  return Boolean(data.user);
}

export function NavbarAdminLink({
  isOverHero,
}: NavbarAdminLinkProps): React.JSX.Element | null {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: unknown) => {
        if (active && hasAuthenticatedUser(data)) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        // Ignore session check failures on public view
      });

    return () => {
      active = false;
    };
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Link
      href="/admin"
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-all",
        isOverHero
          ? "border-white/30 bg-white/12 text-white backdrop-blur-xs hover:bg-white/20"
          : "border-primary/20 bg-primary/8 text-primary hover:bg-primary/15"
      )}
    >
      <ShieldCheck className="size-3.5 shrink-0" />
      <span className="hidden xl:inline">Portal Manajemen</span>
    </Link>
  );
}
