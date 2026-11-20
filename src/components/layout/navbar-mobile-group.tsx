"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface NavbarMobileGroupProps {
  label: string;
  items: NavItem[];
  onNavigate: () => void;
}

export function NavbarMobileGroup({
  label,
  items,
  onNavigate,
}: NavbarMobileGroupProps): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60">
      <button
        type="button"
        onClick={() => {
          setExpanded((prev) => !prev);
        }}
        className="flex w-full cursor-pointer items-center justify-between px-3.5 py-2.5 text-sm font-semibold text-slate-800"
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "size-4 text-slate-400 transition-transform duration-200",
            expanded ? "rotate-180 text-primary" : ""
          )}
        />
      </button>

      {expanded ? (
        <div className="flex flex-col gap-0.5 border-t border-slate-200/70 px-3 py-2.5">
          {items.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              className="rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-white hover:text-primary"
            >
              {child.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
