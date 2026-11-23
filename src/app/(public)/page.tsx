import { env } from "@/config/env";
import { resolveEffectiveModules, resolveSiteConfig } from "@/config/sites";
import { ArticlesSection } from "@/features/articles/components/articles-section";
import {
  getArticleCategories,
  getArticles,
} from "@/features/articles/services/articles.queries";
import { FaqSection } from "@/features/faq/components/faq-accordion";
import { getFaqs } from "@/features/faq/services/faq.queries";
import { SectionRenderer } from "@/features/home/components/section-renderer";
import { getHomePageDetail } from "@/features/home/services/home.queries";
import { ContactHubSection } from "@/features/inquiry/components/contact-hub-section";
import { PartnersSection } from "@/features/partners/components/partners-marquee";
import { getPartners } from "@/features/partners/services/partners.queries";
import { PortfolioSection } from "@/features/portfolio/components/portfolio-section";
import { getPortfolios } from "@/features/portfolio/services/portfolio.queries";
import { ProductsAccordionSection } from "@/features/services/components/products-accordion-section";
import {
  getServices,
  getServiceTypes,
} from "@/features/services/services/services.queries";
import { TestimonialsSection } from "@/features/testimonials/components/testimonials-carousel";
import { getTestimonials } from "@/features/testimonials/services/testimonials.queries";
import { getSiteSettings } from "@/services/api/settings.service";
import { unwrapSettled } from "@/utils/promise";

export const instant = false;

const TOP_SECTION_KEYS = ["hero", "about", "vision_mission"];
const BOTTOM_SECTION_KEYS = ["cta"];

export default async function HomePage(): Promise<React.JSX.Element> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;

  const [
    pageResult,
    servicesResult,
    typesResult,
    portfoliosResult,
    testimonialsResult,
    partnersResult,
    faqsResult,
    articlesResult,
    articleCategoriesResult,
    settings,
  ] = await Promise.all([
    Promise.allSettled([getHomePageDetail(siteKey)]).then((r) =>
      unwrapSettled(r[0], null)
    ),
    Promise.allSettled([getServices(undefined, siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    Promise.allSettled([getServiceTypes(siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    Promise.allSettled([getPortfolios(siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    Promise.allSettled([getTestimonials(siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    Promise.allSettled([getPartners(siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    Promise.allSettled([getFaqs(siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    Promise.allSettled([getArticles(undefined, siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    Promise.allSettled([getArticleCategories(siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    getSiteSettings(siteKey),
  ]);

  const config = resolveSiteConfig(siteKey);
  const effectiveModules = resolveEffectiveModules(
    config.modules,
    settings.modules?.is_active
  );
  const sections = (pageResult?.sections ?? []).filter(
    (s) => s.is_active !== false
  );
  const featuredSection = sections.find((s) => s.key === "featured");
  const officeSection = sections.find((s) => s.key === "office");

  return (
    <div className="flex flex-col">
      <SectionRenderer
        sections={sections}
        allowedKeys={TOP_SECTION_KEYS}
        services={servicesResult}
      />
      <PartnersSection partners={partnersResult} />
      {effectiveModules.services ? (
        <ProductsAccordionSection
          sectionId="featured"
          services={servicesResult}
          types={typesResult}
          badge={featuredSection?.payload?.badge ?? "Layanan Kami"}
          title={featuredSection?.title ?? "Produk Simpanan & Pinjaman"}
          subtitle={
            featuredSection?.body ??
            "Klik produk pada masing-masing kategori untuk melihat ringkasan fitur dan ketentuannya."
          }
          showAllPageLink
        />
      ) : null}
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
        />
      ) : null}
    </div>
  );
}
