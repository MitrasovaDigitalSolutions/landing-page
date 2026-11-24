import { HeroCarousel } from "@/features/home/components/hero-carousel";
import {
  resolveHeroSlides,
  resolvePrimaryCta,
  resolveSecondaryCta,
} from "@/features/home/utils/section-normalizer";
import type { PageSection } from "@/types/api.types";

interface HeroSectionProps {
  section: PageSection;
}

export function HeroSection({ section }: HeroSectionProps): React.JSX.Element {
  const slides = resolveHeroSlides(section);
  const primaryCta = resolvePrimaryCta(section, "Lihat Produk Kami", "#featured");
  const secondaryCta = resolveSecondaryCta(section, "Hubungi Kami", "/kontak");

  return (
    <section aria-label="Sorotan Utama">
      <HeroCarousel
        slides={slides}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
      />
    </section>
  );
}
