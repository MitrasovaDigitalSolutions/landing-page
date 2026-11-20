import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { env } from "@/config/env";
import { HeroCarousel } from "@/features/home/components/hero-carousel";
import { getPageBySlug } from "@/features/home/services/home.queries";
import { resolveHeroSlides } from "@/features/home/utils/section-normalizer";
import { ProductsAccordionSection } from "@/features/services/components/products-accordion-section";
import { ProductsCtaBanner } from "@/features/services/components/products-cta-banner";
import {
  getServices,
  getServiceTypes,
} from "@/features/services/services/services.queries";
import { getSiteSettings } from "@/services/api/settings.service";
import { unwrapSettled } from "@/utils/promise";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const page = await getPageBySlug("produk", siteKey).catch(() => null);

  return {
    title: page?.meta_title ?? page?.title ?? "Produk & Layanan",
    description: page?.meta_desc ?? undefined,
  };
}

export default async function ProdukPage(): Promise<React.JSX.Element> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;

  const [page, services, serviceTypes, settings] = await Promise.all([
    Promise.allSettled([getPageBySlug("produk", siteKey)]).then((r) =>
      unwrapSettled(r[0], null)
    ),
    Promise.allSettled([getServices(undefined, siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    Promise.allSettled([getServiceTypes(siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    getSiteSettings(siteKey),
  ]);

  const sections = page?.sections ?? [];
  const heroSection = sections.find((s) => s.key === "hero");
  const ctaSection = sections.find((s) => s.key === "cta");
  const slides = heroSection ? resolveHeroSlides(heroSection) : [];
  const hasSlides = Boolean(heroSection?.payload?.slides?.length);

  const waDigits = settings.contact?.whatsapp?.replaceAll(/\D/g, "");
  const fallbackWa = waDigits ? `https://wa.me/${waDigits}` : "/kontak";
  const ctaUrl = ctaSection?.payload?.button_url ?? fallbackWa;
  const ctaLabel =
    heroSection?.payload?.cta_label ??
    ctaSection?.payload?.button_label ??
    "Hubungi Kami";

  return (
    <div className="flex flex-col">
      {hasSlides && slides.length > 0 ? (
        <HeroCarousel
          compact
          slides={slides}
          primaryCta={{ text: "Jelajahi Produk", url: "#katalog" }}
          secondaryCta={{ text: ctaLabel, url: ctaUrl }}
        />
      ) : (
        <PageHero
          badge="Layanan Kami"
          title={heroSection?.title ?? page?.title ?? "Produk & Layanan"}
          description={heroSection?.body ?? page?.meta_desc}
        />
      )}

      <ProductsAccordionSection
        sectionId="katalog"
        services={services}
        types={serviceTypes}
        badge="Katalog Produk"
        title="Daftar Produk Simpanan & Pinjaman"
        subtitle="Klik salah satu produk untuk melihat syarat pembukaan rekening, keunggulan, serta ketentuannya."
        showAllPageLink={false}
        defaultExpandFirst
      />

      <ProductsCtaBanner
        section={ctaSection}
        fallbackWhatsapp={settings.contact?.whatsapp}
      />
    </div>
  );
}
