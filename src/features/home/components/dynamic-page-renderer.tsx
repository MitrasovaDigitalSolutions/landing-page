import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/layout/page-hero";
import { SmartImage } from "@/components/shared/smart-image";
import { CtaBannerSection } from "@/features/home/components/cta-banner-section";
import { DynamicSectionGeneric } from "@/features/home/components/dynamic-section-generic";
import { DynamicSectionValues } from "@/features/home/components/dynamic-section-values";
import { HeroCarousel } from "@/features/home/components/hero-carousel";
import {
  resolveHeroSlides,
  resolvePrimaryCta,
  resolveSecondaryCta,
} from "@/features/home/utils/section-normalizer";
import type { PageDetail, PageSection } from "@/types/api.types";
import { resolveMediaUrl } from "@/utils/media";

interface DynamicPageRendererProps {
  page: PageDetail;
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

  const imageUrl = resolveMediaUrl(
    section.payload?.image_url ?? section.image_url,
    section.payload?.image_path ?? section.image_path
  );
  if (imageUrl) {
    const title = section.title ?? page.title;
    const badge = section.payload?.badge ?? section.subtitle ?? page.title;
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

          <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-sm lg:col-span-6">
            <SmartImage
              src={imageUrl}
              alt={title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
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

export function DynamicPageRenderer({
  page,
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
      {sections.map((section, idx) => {
        if (section.key === "hero") {
          return (
            <div key={section.id}>{renderHeroSection(page, section)}</div>
          );
        }

        if (section.key === "cta") {
          return <CtaBannerSection key={section.id} section={section} />;
        }

        const isValuesSection =
          section.key === "values" ||
          Boolean(section.payload?.items?.length) ||
          Array.isArray(section.payload?.openings);
        if (isValuesSection) {
          return <DynamicSectionValues key={section.id} section={section} />;
        }

        return (
          <DynamicSectionGeneric
            key={section.id}
            section={section}
            index={idx}
          />
        );
      })}
    </div>
  );
}
