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

  return (
    <AccordionItem
      value={String(service.id)}
      className="relative border-slate-100 px-5 transition-colors before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-transparent before:transition-colors hover:bg-slate-50/70 data-open:bg-primary/[0.03] data-open:before:bg-primary"
    >
      <AccordionTrigger className="items-center gap-3 rounded-none py-4 hover:no-underline [&_[data-slot=accordion-trigger-icon]]:text-slate-400 group-aria-expanded/accordion-trigger:[&_[data-slot=accordion-trigger-icon]]:text-primary">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-mono text-xs font-bold text-slate-500 tabular-nums transition-colors group-hover/accordion-trigger:bg-primary/10 group-hover/accordion-trigger:text-primary group-aria-expanded/accordion-trigger:bg-primary group-aria-expanded/accordion-trigger:text-white group-aria-expanded/accordion-trigger:shadow-xs">
          {numberLabel}
        </span>

        <div className="min-w-0 flex-1 overflow-hidden pr-2 text-left">
          <span className="block break-words text-sm font-bold tracking-tight text-slate-900 transition-colors group-hover/accordion-trigger:text-primary group-aria-expanded/accordion-trigger:text-primary sm:text-[15px]">
            {service.name}
          </span>
          {service.short_desc ? (
            <span className="mt-0.5 block truncate text-xs font-normal text-slate-500 group-aria-expanded/accordion-trigger:hidden">
              {service.short_desc}
            </span>
          ) : null}
        </div>
      </AccordionTrigger>

      <AccordionContent className="pt-0 pb-4 sm:pl-11">
        <ProductAccordionBody service={service} />
      </AccordionContent>
    </AccordionItem>
  );
}
