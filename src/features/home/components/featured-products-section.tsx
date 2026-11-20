import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { FeaturedCard } from "@/features/home/components/featured-card";
import { resolveFeaturedCards } from "@/features/home/utils/section-normalizer";
import type { PageSection, Service } from "@/types/api.types";

interface FeaturedProductsSectionProps {
  section: PageSection;
  services?: Service[];
}

export function FeaturedProductsSection({
  section,
  services = [],
}: FeaturedProductsSectionProps): React.JSX.Element | null {
  const cards = resolveFeaturedCards(section);
  if (cards.length === 0 && !section.title) {
    return null;
  }

  const badge = section.payload?.badge ?? "Layanan Kami";
  const title = section.title ?? "Produk Unggulan";
  const body = section.body;
  const ctaLabel = section.payload?.cta_label ?? "Lihat Detail Semua Produk";

  return (
    <section
      id="featured"
      className="border-b border-slate-200/80 bg-[#F7F9F7] pt-10 pb-16 md:pt-14 md:pb-24"
    >
      <Container>
        <div className="flex flex-col justify-between gap-6 border-b border-slate-200/80 pb-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2.5">
              <span className="h-0.5 w-6 rounded-full bg-primary" />
              <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
                {badge}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            {body ? (
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {body}
              </p>
            ) : null}
          </div>

          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            className="h-11 shrink-0 gap-2 self-start rounded-xl border-slate-300 bg-white px-5 text-xs font-bold text-slate-800 hover:border-primary/40 hover:bg-primary/5 hover:text-primary md:self-auto"
            render={<Link href="/produk" />}
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {cards.map((card, idx) => (
            <FeaturedCard
              key={card.title}
              card={card}
              index={idx}
              services={services}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
