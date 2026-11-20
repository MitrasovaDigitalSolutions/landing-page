import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types/api.types";

interface ProductAccordionBodyProps {
  service: Service;
}

function resolveServicePoints(service: Service): string[] {
  if (service.features && service.features.length > 0) {
    return service.features.filter(Boolean);
  }
  return service.body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function ProductAccordionBody({
  service,
}: ProductAccordionBodyProps): React.JSX.Element {
  const points = resolveServicePoints(service);
  const categoryName = service.service_type?.name ?? "Layanan";

  return (
    <div className="grid grid-cols-1 gap-5 pt-2 pb-3 md:grid-cols-12">
      <div className="space-y-2.5 md:col-span-8">
        <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Ketentuan & Keunggulan Utama
        </p>

        {points.length > 0 ? (
          <ul className="space-y-2">
            {points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm leading-relaxed text-slate-600">
            {service.short_desc}
          </p>
        )}
      </div>

      <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200/80 bg-[#F7F9F7] p-4 md:col-span-4">
        <div className="space-y-1">
          <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase">
            {categoryName}
          </span>
          <p className="text-xs leading-relaxed text-slate-600">
            Lihat syarat lengkap atau hubungi tim kami untuk konsultasi pengajuan.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            className="h-9 w-full rounded-xl border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-primary/40 hover:text-primary"
            render={<Link href={`/services/${service.slug}`} />}
          >
            <span>Lihat Detail Lengkap</span>
          </Button>
          <Button
            size="sm"
            nativeButton={false}
            className="h-9 w-full gap-1.5 rounded-xl text-xs font-bold"
            render={<Link href="/kontak" />}
          >
            <span>Ajukan / Tanya</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
