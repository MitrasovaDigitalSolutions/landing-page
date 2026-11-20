import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductAccordionBody } from "@/features/services/components/product-accordion-body";
import type { Service } from "@/types/api.types";

interface ProductAccordionRowProps {
  service: Service;
  index: number;
}

export function ProductAccordionRow({
  service,
  index,
}: ProductAccordionRowProps): React.JSX.Element {
  const numberLabel = String(index + 1).padStart(2, "0");
  const categoryName = service.service_type?.name ?? "Layanan";

  return (
    <AccordionItem
      value={String(service.id)}
      className="border-slate-200/80 px-4 transition-colors hover:bg-slate-50/60 sm:px-6"
    >
      <AccordionTrigger className="items-center gap-4 py-4 hover:no-underline">
        <div className="flex min-w-0 flex-1 flex-col gap-1 pr-3 text-left sm:flex-row sm:items-center sm:gap-4">
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-extrabold text-primary tabular-nums">
              {numberLabel}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-600 uppercase">
              {categoryName}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-slate-900 sm:text-base">
              {service.name}
            </span>
            <span className="mt-0.5 block truncate text-xs text-slate-500">
              {service.short_desc}
            </span>
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="border-t border-slate-100">
        <ProductAccordionBody service={service} />
      </AccordionContent>
    </AccordionItem>
  );
}
