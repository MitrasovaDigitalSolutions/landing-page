import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { SmartImage } from "@/components/shared/smart-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Service } from "@/types/api.types";
import { resolveMediaUrl } from "@/utils/media";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps): React.JSX.Element {
  const iconName = service.service_type?.icon ?? service.service_type?.slug;
  const typeName = service.service_type?.name ?? "Layanan";
  const hasThumbnail = Boolean(
    resolveMediaUrl(service.thumbnail_url, service.thumbnail_path)
  );
  const features = service.features ?? [];

  return (
    <Card className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-0 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
      <div>
        {hasThumbnail ? (
          <div className="relative aspect-16/9 w-full overflow-hidden border-b border-slate-100 bg-sky-50">
            <SmartImage
              src={service.thumbnail_url}
              fallbackPath={service.thumbnail_path}
              alt={service.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : null}

        <div className="p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-primary uppercase">
              <DynamicIcon name={iconName} className="size-4 text-primary" />
              {typeName}
            </span>

            {service.is_featured ? (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase">
                Unggulan
              </span>
            ) : null}
          </div>

          <h3 className="mt-3 text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-primary sm:text-xl">
            <Link href={`/services/${service.slug}`}>{service.name}</Link>
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {service.short_desc}
          </p>

          {features.length > 0 ? (
            <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-xs font-medium text-slate-700 sm:text-sm"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2.5 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          className="flex-1 rounded-xl border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100"
          render={<Link href={`/services/${service.slug}`} />}
        >
          <span>Detail & Syarat</span>
        </Button>

        <Button
          size="sm"
          nativeButton={false}
          className="flex-1 rounded-xl text-xs font-semibold"
          render={<Link href="/kontak" />}
        >
          <span>Ajukan</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </Card>
  );
}
