import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ServiceDetailHeroContent } from "@/features/services/components/service-detail-hero-content";
import { ServiceDetailMedia } from "@/features/services/components/service-detail-media";
import { cn } from "@/lib/utils";
import type { Service } from "@/types/api.types";

interface ServiceDetailHeroProps {
  service: Service;
  typeLabel: string;
  iconName?: string | null;
  showShowcaseHero: boolean;
  formattedPrice: string | null;
  waUrl: string | null;
}

export function ServiceDetailHero({
  service,
  typeLabel,
  iconName,
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
            <ServiceDetailMedia service={service} iconName={iconName} />
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
