import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { SmartImage } from "@/components/shared/smart-image";
import { ServiceDetailHeroContent } from "@/features/services/components/service-detail-hero-content";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/api.types";

interface ServiceDetailHeroProps {
  service: Service;
  typeLabel: string;
  iconName?: string | null;
  hasImage: boolean;
  showShowcaseHero: boolean;
  formattedPrice: string | null;
  waUrl: string | null;
}

export function ServiceDetailHero({
  service,
  typeLabel,
  iconName,
  hasImage,
  showShowcaseHero,
  formattedPrice,
  waUrl,
}: ServiceDetailHeroProps): React.JSX.Element {
  return (
    <section className="border-b border-slate-200/80 bg-gradient-to-b from-[#F4F8F5] to-white py-7 md:py-10">
      <Container>
        <Link
          href="/produk"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          <span>Kembali ke Katalog Produk</span>
        </Link>

        <div
          className={cn(
            "mt-5",
            showShowcaseHero &&
              "grid grid-cols-1 items-center gap-7 lg:grid-cols-12 lg:gap-10"
          )}
        >
          {showShowcaseHero ? (
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100 shadow-xs lg:col-span-5">
              {hasImage ? (
                <SmartImage
                  src={service.thumbnail_url}
                  fallbackPath={service.thumbnail_path}
                  alt={service.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center bg-slate-100 text-slate-400">
                  <DynamicIcon
                    name={iconName}
                    fallback={Package}
                    className="size-16 stroke-[1.5]"
                  />
                </div>
              )}

              {service.is_featured ? (
                <span className="absolute top-3 left-3 rounded-full border border-amber-200/90 bg-amber-50/95 px-3 py-1 text-[11px] font-bold tracking-wide text-amber-700 uppercase shadow-2xs backdrop-blur-xs">
                  Unggulan
                </span>
              ) : null}
            </div>
          ) : null}

          <ServiceDetailHeroContent
            service={service}
            typeLabel={typeLabel}
            iconName={iconName}
            showShowcaseHero={showShowcaseHero}
            formattedPrice={formattedPrice}
            waUrl={waUrl}
          />
        </div>
      </Container>
    </section>
  );
}
