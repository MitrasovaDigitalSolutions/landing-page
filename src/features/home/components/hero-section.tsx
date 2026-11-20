import { HeroCarousel } from "@/features/home/components/hero-carousel";
import { HeroStatsBar } from "@/features/home/components/hero-stats-bar";
import {
  resolveHeroSlides,
  resolveHeroStats,
  resolvePrimaryCta,
  resolveSecondaryCta,
} from "@/features/home/utils/section-normalizer";
import type { PageSection } from "@/types/api.types";

interface HeroSectionProps {
  section: PageSection;
}

export function HeroSection({ section }: HeroSectionProps): React.JSX.Element {
  const slides = resolveHeroSlides(section);
  const stats = resolveHeroStats(section);
  const primaryCta = resolvePrimaryCta(section, "Lihat Produk Kami", "#featured");
  const secondaryCta = resolveSecondaryCta(section, "Hubungi Kami", "/kontak");

  return (
    <section aria-label="Sorotan Utama">
      <HeroCarousel
        slides={slides}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
      />
      <HeroStatsBar stats={stats} />
    </section>
  );
}
