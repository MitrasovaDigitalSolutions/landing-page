import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { cn } from "@/lib/utils";
import type { ServiceType } from "@/types/api.types";
import { Layers } from "lucide-react";

interface ServiceTypeTabsProps {
  types: ServiceType[];
  totalCount: number;
  selectedTypeSlug: string;
  onSelectType: (slug: string) => void;
}

export function ServiceTypeTabs({
  types,
  totalCount,
  selectedTypeSlug,
  onSelectType,
}: ServiceTypeTabsProps): React.JSX.Element {
  const activeType = types.find((t) => t.slug === selectedTypeSlug);

  return (
    <div className="mb-5 space-y-3">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3.5">
        <button
          type="button"
          onClick={() => {
            onSelectType("all");
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all sm:text-sm",
            selectedTypeSlug === "all"
              ? "border-primary bg-primary text-white shadow-sm shadow-primary/20"
              : "border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary"
          )}
        >
          <Layers className="size-4" />
          <span>Semua Kategori</span>
          <span className="rounded-md bg-black/10 px-1.5 py-0.5 text-[11px] font-bold">
            {totalCount}
          </span>
        </button>

        {types.map((type) => {
          const isSelected = selectedTypeSlug === type.slug;
          const count = type.services_count ?? 0;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => {
                onSelectType(type.slug);
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all sm:text-sm",
                isSelected
                  ? "border-primary bg-primary text-white shadow-sm shadow-primary/20"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary"
              )}
            >
              <DynamicIcon name={type.icon ?? type.slug} className="size-4" />
              <span>{type.name}</span>
              {count > 0 ? (
                <span className="rounded-md bg-black/10 px-1.5 py-0.5 text-[11px] font-bold">
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {activeType?.description ? (
        <p className="text-xs font-medium text-slate-500 sm:text-sm">
          {activeType.description}
        </p>
      ) : null}
    </div>
  );
}
