import type { Metadata } from "next";
import { HomeServicesSlot } from "@/app/(public)/_components/home-services-slot";
import { JsonLd } from "@/components/shared/json-ld";
import { env } from "@/config/env";
import { resolveEffectiveModules, resolveSiteConfig } from "@/config/sites";
import { ArticlesSection } from "@/features/articles/components/articles-section";
import {
  getArticleCategories,
  getArticles,
} from "@/features/articles/services/articles.queries";
import { FaqSection } from "@/features/faq/components/faq-accordion";
import { getFaqs } from "@/features/faq/services/faq.queries";
import { getBranches } from "@/features/branches/services/branches.queries";
import { SectionRenderer } from "@/features/home/components/section-renderer";
import { getHomePageDetail } from "@/features/home/services/home.queries";
import { resolveHeroSlides } from "@/features/home/utils/section-normalizer";
import { ContactHubSection } from "@/features/inquiry/components/contact-hub-section";
import { PartnersSection } from "@/features/partners/components/partners-marquee";
import { getPartners } from "@/features/partners/services/partners.queries";
import { PortfolioSection } from "@/features/portfolio/components/portfolio-section";
import { getPortfolios } from "@/features/portfolio/services/portfolio.queries";
import {
  getServices,
  getServiceTypes,
} from "@/features/services/services/services.queries";
import { resolveServicesLayout } from "@/features/services/utils/service-display";
import { TestimonialsSection } from "@/features/testimonials/components/testimonials-carousel";
import { getTestimonials } from "@/features/testimonials/services/testimonials.queries";
import { buildPageMetadata, pickNonEmptyText, resolveSiteUrl } from "@/lib/seo";
import { buildFaqJsonLd } from "@/lib/seo-jsonld";
import { getSiteSettings } from "@/services/api/settings.service";
import { resolveMediaUrl } from "@/utils/media";
import { unwrapSettled } from "@/utils/promise";

export const instant = false;

const TOP_SECTION_KEYS = ["hero", "about", "visi-misi", "vision_mission"];
const BOTTOM_SECTION_KEYS = ["cta"];

export async function generateMetadata(): Promise<Metadata> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);
  const [page, settings] = await Promise.all([
    getHomePageDetail(siteKey),
    getSiteSettings(siteKey),
  ]);

  const siteUrl = resolveSiteUrl(settings);
  const siteName =
    pickNonEmptyText(settings.general?.site_title) ?? config.name;
  const tagline = pickNonEmptyText(settings.general?.tagline);
  const title =
    pickNonEmptyText(settings.seo?.meta_title, page?.meta_title) ??
    (tagline ? `${siteName} — ${tagline}` : siteName);

  const heroSection = page?.sections?.find((s) => s.key === "hero");
  const firstSlide = heroSection ? resolveHeroSlides(heroSection).at(0) : undefined;
  const heroImage = firstSlide
    ? resolveMediaUrl(firstSlide.image_url, firstSlide.image_path)
    : null;

  return buildPageMetadata({
    title,
    description: settings.seo?.meta_description ?? page?.meta_desc,
    path: "/",
    siteUrl,
    config,
    settings,
    imagePathOrUrl: heroImage,
  });
}

async function loadHomePageData(siteKey: string) {
  const [pageResult, settings] = await Promise.all([
    Promise.allSettled([getHomePageDetail(siteKey)]).then((r) => unwrapSettled(r[0], null)),
    getSiteSettings(siteKey),
  ]);

  const config = resolveSiteConfig(siteKey);
  const effectiveModules = resolveEffectiveModules(
    config.modules,
    settings.modules?.is_active
  );

  const [
    servicesResult,
    featuredServicesResult,
    typesResult,
    portfoliosResult,
    testimonialsResult,
    partnersResult,
    faqsResult,
    articlesResult,
    articleCategoriesResult,
    branchesResult,
  ] = await Promise.all([
    effectiveModules.services
      ? Promise.allSettled([getServices(undefined, siteKey)]).then((r) => unwrapSettled(r[0], []))
      : Promise.resolve([]),
    effectiveModules.services
      ? Promise.allSettled([getServices({ featured: true, perPage: 20 }, siteKey)]).then((r) =>
          unwrapSettled(r[0], [])
        )
      : Promise.resolve([]),
    effectiveModules.services
      ? Promise.allSettled([getServiceTypes(siteKey)]).then((r) => unwrapSettled(r[0], []))
      : Promise.resolve([]),
    effectiveModules.portfolios
      ? Promise.allSettled([getPortfolios(siteKey)]).then((r) => unwrapSettled(r[0], []))
      : Promise.resolve([]),
    Promise.allSettled([getTestimonials(siteKey)]).then((r) => unwrapSettled(r[0], [])),
    Promise.allSettled([getPartners(siteKey)]).then((r) => unwrapSettled(r[0], [])),
    Promise.allSettled([getFaqs(siteKey)]).then((r) => unwrapSettled(r[0], [])),
    effectiveModules.articles
      ? Promise.allSettled([getArticles(undefined, siteKey)]).then((r) => unwrapSettled(r[0], []))
      : Promise.resolve([]),
    effectiveModules.articles
      ? Promise.allSettled([getArticleCategories(siteKey)]).then((r) => unwrapSettled(r[0], []))
      : Promise.resolve([]),
    effectiveModules.branches && effectiveModules.contact
      ? Promise.allSettled([getBranches(siteKey)]).then((r) => unwrapSettled(r[0], []))
      : Promise.resolve([]),
  ]);

  const sections = (pageResult?.sections ?? []).filter((s) => s.is_active !== false);
  const productsSection = sections.find((s) => s.key === "products");
  const rawLimit = productsSection?.payload?.limit;
  const productsLimit = typeof rawLimit === "number" && rawLimit > 0 ? rawLimit : 12;
  const featuredServices = (
    featuredServicesResult.length > 0 ? featuredServicesResult : servicesResult
  ).slice(0, productsLimit);

  return {
    effectiveModules,
    servicesLayout: resolveServicesLayout(settings.services?.layout),
    sections,
    servicesResult,
    featuredServices,
    typesResult,
    portfoliosResult,
    testimonialsResult,
    partnersResult,
    faqsResult,
    articlesResult,
    articleCategoriesResult,
    branchesResult,
    settings,
    siteName: settings.general?.site_title ?? config.name,
    siteUrl: resolveSiteUrl(settings),
    officeSection: sections.find((s) => s.key === "office"),
  };
}

export default async function HomePage(): Promise<React.JSX.Element> {
  const {
    effectiveModules,
    servicesLayout,
    sections,
    servicesResult,
    featuredServices,
    typesResult,
    portfoliosResult,
    testimonialsResult,
    partnersResult,
    faqsResult,
    articlesResult,
    articleCategoriesResult,
    branchesResult,
    settings,
    siteName,
    siteUrl,
    officeSection,
  } = await loadHomePageData(env.NEXT_PUBLIC_SITE_KEY);

  return (
    <div className="flex flex-col">
      <JsonLd data={buildFaqJsonLd(faqsResult)} />
      <SectionRenderer
        sections={sections}
        allowedKeys={TOP_SECTION_KEYS}
        services={effectiveModules.services ? servicesResult : []}
      />
      <PartnersSection partners={partnersResult} />
      <HomeServicesSlot
        enabled={effectiveModules.services}
        layout={servicesLayout}
        sections={sections}
        services={servicesResult}
        featuredServices={featuredServices}
        types={typesResult}
      />
      {effectiveModules.portfolios ? (
        <PortfolioSection portfolios={portfoliosResult} />
      ) : null}
      <TestimonialsSection testimonials={testimonialsResult} />
      {effectiveModules.articles ? (
        <ArticlesSection
          articles={articlesResult}
          categories={articleCategoriesResult}
        />
      ) : null}
      <FaqSection faqs={faqsResult} />
      <SectionRenderer
        sections={sections}
        allowedKeys={BOTTOM_SECTION_KEYS}
        contact={settings.contact}
        legal={settings.legal}
      />
      {effectiveModules.contact ? (
        <ContactHubSection
          officeSection={officeSection}
          contact={settings.contact}
          legal={settings.legal}
          branches={branchesResult}
          siteName={siteName}
          siteUrl={siteUrl}
        />
      ) : null}
    </div>
  );
}
