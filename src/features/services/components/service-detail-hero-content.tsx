import { ArrowDown, MessageCircle, Package } from "lucide-react";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types/api.types";

interface ServiceDetailHeroContentProps {
  service: Service;
  typeLabel: string;
  iconName?: string | null;
  showShowcaseHero: boolean;
  formattedPrice: string | null;
  waUrl: string | null;
}

export function ServiceDetailHeroContent({
  service,
  typeLabel,
  iconName,
  showShowcaseHero,
  formattedPrice,
  waUrl,
}: ServiceDetailHeroContentProps): React.JSX.Element {
  return (
    <div className={showShowcaseHero ? "lg:col-span-7" : "max-w-4xl"}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-0.5 text-[11px] font-bold tracking-wider text-primary uppercase">
          <DynamicIcon
            name={iconName}
            fallback={showShowcaseHero ? Package : undefined}
            className="size-3.5"
          />
          <span>{typeLabel}</span>
        </span>

        {!showShowcaseHero && service.is_featured ? (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase">
            Unggulan
          </span>
        ) : null}
      </div>

      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
        {service.name}
      </h1>

      {formattedPrice ? (
        <div className="mt-4 inline-flex flex-wrap items-baseline gap-1.5 rounded-xl border border-primary/20 bg-white px-4 py-2.5 shadow-2xs">
          <span className="text-xl font-extrabold text-primary tabular-nums sm:text-2xl">
            {formattedPrice}
          </span>
          {service.price_note ? (
            <span className="text-sm font-medium text-slate-500">
              {service.price_note}
            </span>
          ) : null}
        </div>
      ) : null}

      {service.short_desc ? (
        <p className="mt-3.5 text-sm leading-relaxed text-slate-600 sm:text-base">
          {service.short_desc}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {waUrl ? (
          <Button
            size="lg"
            nativeButton={false}
            className="h-11 gap-2 rounded-xl px-5 text-xs font-bold shadow-xs"
            render={
              <a href={waUrl} target="_blank" rel="noopener noreferrer" />
            }
          >
            <MessageCircle className="size-4" />
            <span>Tanya via WhatsApp</span>
          </Button>
        ) : null}

        <Button
          variant="outline"
          size="lg"
          nativeButton={false}
          className="h-11 gap-2 rounded-xl border-slate-300 bg-white px-5 text-xs font-bold text-slate-800 hover:border-primary/40 hover:text-primary"
          render={<a href="#konsultasi" />}
        >
          <span>Ajukan & Konsultasi</span>
          <ArrowDown className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
