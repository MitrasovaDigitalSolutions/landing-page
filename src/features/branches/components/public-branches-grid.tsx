"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BranchCard } from "@/features/branches/components/branch-card";
import { cn } from "@/lib/utils";
import type { Branch } from "@/types/api.types";

interface PublicBranchesGridProps {
  branches: Branch[];
}

type BranchFilter = "all" | "primary" | "branch";

export function PublicBranchesGrid({
  branches,
}: PublicBranchesGridProps): React.JSX.Element {
  const [query, setQuery] = useState("");
  const [filterKind, setFilterKind] = useState<BranchFilter>("all");

  const sortedBranches = [...branches].sort(
    (a, b) => Number(b.is_primary) - Number(a.is_primary) || a.order - b.order
  );

  const normalizedQuery = query.trim().toLowerCase();
  const filteredBranches = sortedBranches.filter((branch) => {
    if (filterKind === "primary" && !branch.is_primary) {
      return false;
    }
    if (filterKind === "branch" && branch.is_primary) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    return (
      branch.name.toLowerCase().includes(normalizedQuery) ||
      branch.address.toLowerCase().includes(normalizedQuery)
    );
  });

  const primaryCount = sortedBranches.filter((b) => b.is_primary).length;
  const branchCount = sortedBranches.length - primaryCount;

  const filterTabs: { id: BranchFilter; label: string; count: number }[] = [
    { id: "all", label: "Semua Kantor", count: sortedBranches.length },
    { id: "primary", label: "Kantor Pusat", count: primaryCount },
    { id: "branch", label: "Kantor Cabang", count: branchCount },
  ];

  return (
    <section className="bg-white py-8 md:py-10">
      <Container>
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setFilterKind(tab.id);
                }}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                  filterKind === tab.id
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/40 hover:text-primary"
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder="Cari nama cabang atau lokasi..."
              className="pl-9"
              aria-label="Cari kantor cabang"
            />
          </div>
        </div>

        {filteredBranches.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredBranches.map((branch, idx) => (
              <BranchCard key={branch.id} branch={branch} index={idx} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
            <p className="text-sm font-semibold text-slate-700">
              Tidak ada kantor cabang yang sesuai dengan pencarian Anda.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 rounded-xl"
              onClick={() => {
                setQuery("");
                setFilterKind("all");
              }}
            >
              Reset Pencarian
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
