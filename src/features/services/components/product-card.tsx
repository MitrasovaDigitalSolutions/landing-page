import { Package } from "lucide-react";
import Link from "next/link";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { SmartImage } from "@/components/shared/smart-image";
import { Card } from "@/components/ui/card";
import { formatServicePrice } from "@/features/services/utils/service-display";
import type { Service } from "@/types/api.types";
import { resolveMediaUrl } from "@/utils/media";

interface ProductCardProps {
  service: Service;
}

export function ProductCard({ service }: ProductCardProps): React.JSX.Element {
  const iconName = service.service_type?.icon ?? service.service_type?.slug;
  const typeName = service.service_type?.name;
  const hasThumbnail = Boolean(
    resolveMediaUrl(service.thumbnail_url, service.thumbnail_path)
  );
  const formattedPrice = formatServicePrice(service.price);

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-0 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
      <Link
        href={`/services/${service.slug}`}
        className="relative block aspect-4/3 w-full overflow-hidden border-b border-slate-100 bg-slate-100"
      >
        {hasThumbnail ? (
          <SmartImage
            src={service.thumbnail_url}
            fallbackPath={service.thumbnail_path}
            alt={service.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400 transition-colors group-hover:bg-slate-200/70 group-hover:text-primary/70">
            <DynamicIcon
              name={iconName}
              fallback={Package}
              className="size-10 stroke-[1.6]"
            />
          </div>
        )}

        {service.is_featured ? (
          <span className="absolute top-2.5 left-2.5 rounded-full border border-amber-200/90 bg-amber-50/95 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-700 uppercase shadow-2xs backdrop-blur-xs">
            Unggulan
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {typeName ? (
          <span className="text-[11px] font-bold tracking-wider text-primary uppercase">
            {typeName}
          </span>
        ) : null}

        <h3 className="mt-1 line-clamp-2 text-sm font-bold tracking-tight text-slate-900 transition-colors group-hover:text-primary sm:text-base">
          <Link href={`/services/${service.slug}`}>{service.name}</Link>
        </h3>

        {service.short_desc ? (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
            {service.short_desc}
          </p>
        ) : null}

        {formattedPrice ? (
          <div className="mt-auto flex flex-wrap items-baseline gap-1 border-t border-slate-100 pt-3">
            <span className="text-sm font-extrabold text-primary tabular-nums sm:text-base">
              {formattedPrice}
            </span>
            {service.price_note ? (
              <span className="text-xs font-medium text-slate-500">
                {service.price_note}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
