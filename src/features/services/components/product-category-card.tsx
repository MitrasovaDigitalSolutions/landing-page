import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { ProductAccordionRow } from "@/features/services/components/product-accordion-row";
import type { ServiceCategoryGroup } from "@/features/services/utils/group-services";

interface ProductCategoryCardProps {
  group: ServiceCategoryGroup;
}

export function ProductCategoryCard({
  group,
}: ProductCategoryCardProps): React.JSX.Element {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/85 border-t-2 border-t-primary/75 bg-white shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <DynamicIcon name={group.icon ?? group.slug} className="size-[18px]" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-extrabold tracking-tight text-slate-900">
              {group.name}
            </h3>
            {group.description ? (
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {group.description}
              </p>
            ) : null}
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600 tabular-nums shadow-2xs">
          {group.services.length} Produk
        </span>
      </div>

      <div>
        {group.services.map((service, idx) => (
          <ProductAccordionRow
            key={service.id}
            service={service}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}
