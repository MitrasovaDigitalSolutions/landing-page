import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/layout/section-heading";
import { env } from "@/config/env";
import { resolveEffectiveModules, resolveSiteConfig } from "@/config/sites";
import { HeroCarousel } from "@/features/home/components/hero-carousel";
import { getPageBySlug } from "@/features/home/services/home.queries";
import { resolveHeroSlides } from "@/features/home/utils/section-normalizer";
import { ProductGrid } from "@/features/services/components/product-grid";
import { ProductsAccordionSection } from "@/features/services/components/products-accordion-section";
import { ProductsCtaBanner } from "@/features/services/components/products-cta-banner";
import {
  getServices,
  getServiceTypes,
} from "@/features/services/services/services.queries";
import { resolveServicesLayout } from "@/features/services/utils/service-display";
import { buildPageMetadata, resolveSiteUrl } from "@/lib/seo";
import { getSiteSettings } from "@/services/api/settings.service";
import { unwrapSettled } from "@/utils/promise";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);
  const [page, settings] = await Promise.all([
    getPageBySlug("produk", siteKey).catch(() => null),
    getSiteSettings(siteKey),
  ]);

  return buildPageMetadata({
    title: page?.meta_title ?? page?.title ?? "Produk & Layanan",
    description: page?.meta_desc,
    path: "/produk",
    siteUrl: resolveSiteUrl(settings),
    config,
    settings,
  });
}

export default async function ProdukPage(): Promise<React.JSX.Element> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;

  const [page, services, serviceTypes, settings] = await Promise.all([
    Promise.allSettled([getPageBySlug("produk", siteKey)]).then((r) =>
      unwrapSettled(r[0], null)
    ),
    Promise.allSettled([getServices({ perPage: 100 }, siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    Promise.allSettled([getServiceTypes(siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    getSiteSettings(siteKey),
  ]);

  const effectiveModules = resolveEffectiveModules(
    resolveSiteConfig(siteKey).modules,
    settings.modules?.is_active
  );
  if (!effectiveModules.services || page?.is_active === false) {
    notFound();
  }

  const servicesLayout = resolveServicesLayout(settings.services?.layout);
  const sections = (page?.sections ?? []).filter((s) => s.is_active !== false);
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

  const catalogTitle =
    heroSection?.title ?? page?.title ?? "Daftar Produk & Layanan";
  const catalogSubtitle =
    heroSection?.body ??
    (servicesLayout === "accordion"
      ? "Klik salah satu produk pada kategori di bawah untuk melihat syarat, keunggulan, serta ketentuannya."
      : "Pilih produk untuk melihat detail spesifikasi, harga, dan informasi pemesanan.");

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

      {servicesLayout === "accordion" ? (
        <ProductsAccordionSection
          sectionId="katalog"
          services={services}
          types={serviceTypes}
          badge="Katalog Produk"
          title={catalogTitle}
          subtitle={catalogSubtitle}
          showAllPageLink={false}
        />
      ) : (
        <section
          id="katalog"
          className="border-b border-slate-200/80 bg-[#F7F9F7] py-10 md:py-14"
        >
          <Container>
            <SectionHeading
              badge="Katalog Produk"
              title={catalogTitle}
              subtitle={catalogSubtitle}
            />
            {services.length > 0 ? (
              <ProductGrid
                services={services}
                types={serviceTypes}
                enableCategoryFilter
              />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                Belum ada produk yang tersedia saat ini.
              </div>
            )}
          </Container>
        </section>
      )}

      <ProductsCtaBanner
        section={ctaSection}
        fallbackWhatsapp={settings.contact?.whatsapp}
      />
    </div>
  );
}
