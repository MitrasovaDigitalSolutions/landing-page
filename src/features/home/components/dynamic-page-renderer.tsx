import { MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { HistorySection } from "@/components/sections/history-section";
import { InstagramSection } from "@/components/sections/instagram-section";
import { StrategyProgramSection } from "@/components/sections/strategy-program-section";
import { VisionMissionSection } from "@/components/sections/vision-mission-section";
import { SmartImage } from "@/components/shared/smart-image";
import { AboutStatsSection } from "@/features/home/components/about-stats-section";
import { CtaBannerSection } from "@/features/home/components/cta-banner-section";
import { DynamicSectionGeneric } from "@/features/home/components/dynamic-section-generic";
import { DynamicSectionValues } from "@/features/home/components/dynamic-section-values";
import { FeaturedProductsSection } from "@/features/home/components/featured-products-section";
import { HeadOfficeSection } from "@/features/home/components/head-office-section";
import { HeroCarousel } from "@/features/home/components/hero-carousel";
import {
  resolveHeroSlides,
  resolvePrimaryCta,
  resolveSecondaryCta,
} from "@/features/home/utils/section-normalizer";
import type { PageDetail, PageSection, Service } from "@/types/api.types";
import type {
  SiteContactSettings,
  SiteLegalSettings,
} from "@/types/site-settings.types";
import { resolvePayloadMediaUrl } from "@/utils/media";

interface DynamicPageRendererProps {
  page: PageDetail;
  services?: Service[];
  contact?: SiteContactSettings;
  legal?: SiteLegalSettings;
}

function renderHeroSection(
  page: PageDetail,
  section: PageSection
): React.JSX.Element {
  const hasSlides = Boolean(section.payload?.slides?.length);
  if (hasSlides) {
    return (
      <HeroCarousel
        compact
        slides={resolveHeroSlides(section)}
        primaryCta={resolvePrimaryCta(section, "Pelajari Lebih Lanjut", "#konten")}
        secondaryCta={resolveSecondaryCta(section, "Hubungi Kami", "/kontak")}
      />
    );
  }

  const imageUrl = resolvePayloadMediaUrl(
    section.payload?.image_path,
    section.payload?.image_url,
    section.image_url,
    section.image_path
  );
  if (imageUrl) {
    const title = section.title ?? page.title;
    const badge = section.payload?.badge ?? section.subtitle ?? page.title;
    const imageLabel = section.payload?.image_label;
    const imageCaption = section.payload?.image_caption;
    return (
      <section className="border-b border-slate-200/80 bg-gradient-to-b from-[#F4F8F5] to-white py-8 md:py-12">
        <Container className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="mb-2.5 inline-flex items-center gap-2.5">
              <span className="h-0.5 w-6 rounded-full bg-primary" />
              <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
                {badge}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {title}
            </h1>
            {section.body ? (
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {section.body}
              </p>
            ) : null}
          </div>

          <figure className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-sm lg:col-span-6">
            <div className="relative aspect-16/10 w-full">
              <SmartImage
                src={imageUrl}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {imageLabel || imageCaption ? (
              <figcaption className="flex items-start gap-2 border-t border-slate-200/80 bg-white px-4 py-3 text-xs text-slate-600">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  {imageLabel ? (
                    <p className="font-bold text-slate-900">{imageLabel}</p>
                  ) : null}
                  {imageCaption ? <p className="mt-0.5">{imageCaption}</p> : null}
                </div>
              </figcaption>
            ) : null}
          </figure>
        </Container>
      </section>
    );
  }

  return (
    <PageHero
      badge={section.payload?.badge ?? section.subtitle ?? page.title}
      title={section.title ?? page.title}
      description={section.body ?? page.meta_desc}
      stats={section.payload?.stats}
    />
  );
}

function renderSectionByType(
  page: PageDetail,
  section: PageSection,
  idx: number,
  options: Pick<DynamicPageRendererProps, "services" | "contact" | "legal">
): React.JSX.Element {
  switch (section.key) {
    case "hero":
      return <div key={section.id}>{renderHeroSection(page, section)}</div>;
    case "featured":
      return (
        <FeaturedProductsSection
          key={section.id}
          section={section}
          services={options.services}
        />
      );
    case "about":
      return <AboutStatsSection key={section.id} section={section} />;
    case "office":
      return (
        <HeadOfficeSection
          key={section.id}
          section={section}
          contact={options.contact}
          legal={options.legal}
        />
      );
    case "cta":
      return <CtaBannerSection key={section.id} section={section} />;
    case "sejarah":
      return <HistorySection key={section.id} section={section} />;
    case "visi-misi":
    case "vision_mission":
      return <VisionMissionSection key={section.id} section={section} />;
    case "strategi":
    case "program":
      return <StrategyProgramSection key={section.id} section={section} />;
    case "values":
      return <DynamicSectionValues key={section.id} section={section} />;
    case "instagram":
      return <InstagramSection key={section.id} section={section} />;
    default: {
      const hasValuesPayload =
        Boolean(section.payload?.items?.length) ||
        Array.isArray(section.payload?.openings);
      if (hasValuesPayload) {
        return <DynamicSectionValues key={section.id} section={section} />;
      }
      return (
        <DynamicSectionGeneric key={section.id} section={section} index={idx} />
      );
    }
  }
}

export function DynamicPageRenderer({
  page,
  services,
  contact,
  legal,
}: DynamicPageRendererProps): React.JSX.Element {
  const sections = [...(page.sections ?? [])]
    .filter((s) => s.is_active !== false)
    .sort((a, b) => a.order - b.order);

  if (sections.length === 0) {
    return (
      <div className="flex flex-col">
        <PageHero
          badge="Halaman"
          title={page.title}
          description={page.meta_desc}
        />
        <section className="bg-white py-12">
          <Container>
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-sm text-slate-500">
              Konten untuk halaman ini sedang dipersiapkan.
            </p>
          </Container>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {sections.map((section, idx) =>
        renderSectionByType(page, section, idx, { services, contact, legal })
      )}
    </div>
  );
}
