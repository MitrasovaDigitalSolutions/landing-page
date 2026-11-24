import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ProductGrid } from "@/features/services/components/product-grid";
import { ServiceSiblingsBox } from "@/features/services/components/service-siblings-box";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/api.types";
import type { ServicesLayout } from "@/types/site-settings.types";

interface ServiceDetailBodyProps {
  serviceName: string;
  typeLabel: string;
  servicesLayout: ServicesLayout;
  points: string[];
  features: string[];
  distinctBody: string[];
  siblingServices: Service[];
}

export function ServiceDetailBody({
  serviceName,
  typeLabel,
  servicesLayout,
  points,
  features,
  distinctBody,
  siblingServices,
}: ServiceDetailBodyProps): React.JSX.Element {
  const useTwoColPoints = points.length > 3;

  let relatedBlock: React.ReactNode = null;
  if (siblingServices.length > 0) {
    relatedBlock =
      servicesLayout !== "accordion" ? (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              Produk {typeLabel} Lainnya
            </h2>
            <Link
              href="/produk"
              className="text-xs font-bold text-primary hover:underline"
            >
              Lihat semua →
            </Link>
          </div>
          <ProductGrid services={siblingServices.slice(0, 4)} />
        </div>
      ) : (
        <ServiceSiblingsBox typeLabel={typeLabel} services={siblingServices} />
      );
  }

  return (
    <section className="bg-white py-8 md:py-12">
      <Container className="space-y-7">
        {points.length > 0 ? (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-7">
            <span className="text-[11px] font-bold tracking-wider text-primary uppercase">
              Ketentuan & Keunggulan
            </span>
            <h2 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
              Spesifikasi {serviceName}
            </h2>

            <ul
              className={cn(
                "mt-4 grid gap-3 border-t border-slate-100 pt-5",
                useTwoColPoints ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
              )}
            >
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
          </div>
        ) : null}

        {features.length > 0 && distinctBody.length > 0 ? (
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-7">
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              Informasi Tambahan
            </h2>
            <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-600">
              {distinctBody.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        ) : null}

        {relatedBlock}
      </Container>
    </section>
  );
}
