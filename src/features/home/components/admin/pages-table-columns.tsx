"use client";

import { ExternalLink, FileText, Home, Layers, Lock } from "lucide-react";
import Link from "next/link";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PageDetail } from "@/types/api.types";

function getSectionsCount(page: PageDetail): number {
  if (typeof page.sections_count === "number") {
    return page.sections_count;
  }
  return Array.isArray(page.sections) ? page.sections.length : 0;
}

export function isPagePublished(page: PageDetail): boolean {
  return page.is_published ?? page.is_active ?? true;
}

export function buildPageColumns(
  onManageSections: (page: PageDetail) => void
): DataTableColumnDef<PageDetail>[] {
  return [
    {
      accessorKey: "title",
      header: "Halaman",
      cell: ({ row }) => {
        const page = row.original;
        const subtitle =
          page.meta_desc ?? page.meta_title ?? "Metadata SEO belum diatur";
        return (
          <div className="flex max-w-md items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-primary">
              {page.slug === "home" ? (
                <Home className="size-4" />
              ) : (
                <FileText className="size-4" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {page.title}
              </p>
              <p className="truncate text-[11px] text-slate-500">{subtitle}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "slug",
      header: "URL Halaman",
      meta: { headerClassName: "w-44" },
      cell: ({ row }) => {
        const page = row.original;
        const isHome = page.slug === "home";
        const routeLabel = isHome ? "/" : `/${page.slug}`;

        if (isPagePublished(page)) {
          return (
            <Link
              href={routeLabel}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="group/link inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1 font-mono text-xs font-medium text-slate-700 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              {isHome ? <Lock className="size-3 text-slate-400" /> : null}
              <span>{routeLabel}</span>
              <ExternalLink className="size-3 text-slate-400 group-hover/link:text-primary" />
            </Link>
          );
        }

        return (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1 font-mono text-xs font-medium text-slate-500">
            {isHome ? <Lock className="size-3 text-slate-400" /> : null}
            <span>{routeLabel}</span>
          </span>
        );
      },
    },
    {
      id: "sections_count",
      accessorFn: (row) => getSectionsCount(row),
      header: "Konten Section",
      meta: { headerClassName: "w-36" },
      cell: ({ row }) => {
        const count = getSectionsCount(row.original);
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onManageSections(row.original);
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 tabular-nums transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
          >
            <Layers className="size-3.5 text-primary" />
            <span>{count} Section</span>
          </button>
        );
      },
    },
    {
      id: "status",
      accessorFn: (row) => (isPagePublished(row) ? "published" : "draft"),
      header: "Status",
      meta: { headerClassName: "w-28" },
      cell: ({ row }) => (
        <StatusBadge
          status={isPagePublished(row.original) ? "published" : "draft"}
        />
      ),
    },
  ];
}
