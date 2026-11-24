import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types/api.types";

interface ProductAccordionBodyProps {
  service: Service;
}

const MAX_PREVIEW_POINTS = 4;

function resolveServicePoints(service: Service): string[] {
  if (service.features && service.features.length > 0) {
    return service.features.filter(Boolean);
  }
  if (!service.body) {
    return [];
  }
  return service.body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function ProductAccordionBody({
  service,
}: ProductAccordionBodyProps): React.JSX.Element {
  const allPoints = resolveServicePoints(service);
  const previewPoints = allPoints.slice(0, MAX_PREVIEW_POINTS);
  const remainingCount = Math.max(0, allPoints.length - previewPoints.length);

  return (
    <div className="space-y-3 pt-0.5">
      {service.short_desc ? (
        <p className="text-[13px] leading-relaxed text-slate-600">
          {service.short_desc}
        </p>
      ) : null}

      {previewPoints.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Keunggulan & Ketentuan
          </p>
          <ul className="space-y-2">
            {previewPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 text-[13px] leading-snug text-slate-700"
              >
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {remainingCount > 0 ? (
        <p className="text-[11px] font-medium text-slate-400">
          +{remainingCount} ketentuan lainnya di halaman detail
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-200/70 pt-3">
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-primary no-underline! transition-colors hover:text-primary/80!"
        >
          <span>Lihat detail</span>
          <ArrowUpRight className="size-3.5" />
        </Link>

        <Button
          size="sm"
          nativeButton={false}
          className="h-8 gap-1.5 rounded-lg px-3.5 text-xs font-semibold no-underline! hover:text-primary-foreground!"
          render={<Link href="/kontak" />}
        >
          <span>Ajukan</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
