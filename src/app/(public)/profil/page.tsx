import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InstagramSection } from "@/components/sections/instagram-section";
import { StrategyProgramSection } from "@/components/sections/strategy-program-section";
import { env } from "@/config/env";
import { resolveSiteConfig } from "@/config/sites";
import { AboutStatsSection } from "@/features/home/components/about-stats-section";
import { CtaBannerSection } from "@/features/home/components/cta-banner-section";
import { DynamicSectionGeneric } from "@/features/home/components/dynamic-section-generic";
import { DynamicSectionValues } from "@/features/home/components/dynamic-section-values";
import { FeaturedProductsSection } from "@/features/home/components/featured-products-section";
import { HeadOfficeSection } from "@/features/home/components/head-office-section";
import { getPageBySlug } from "@/features/home/services/home.queries";
import { isVisionMissionKey } from "@/features/home/utils/section-normalizer";
import { ProfileHero } from "@/features/profile/components/profile-hero";
import { ProfileHistory } from "@/features/profile/components/profile-history";
import { ProfileStrategyTabs } from "@/features/profile/components/profile-strategy-tabs";
import { ProfileVisionMission } from "@/features/profile/components/profile-vision-mission";
import { buildPageMetadata, resolveSiteUrl } from "@/lib/seo";
import { getSiteSettings } from "@/services/api/settings.service";
import { unwrapSettled } from "@/utils/promise";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);
  const [page, settings] = await Promise.all([
    getPageBySlug("profil", siteKey).catch(() => null),
    getSiteSettings(siteKey),
  ]);

  return buildPageMetadata({
    title: page?.meta_title ?? page?.title ?? "Profil",
    description: page?.meta_desc,
    path: "/profil",
    siteUrl: resolveSiteUrl(settings),
    config,
    settings,
  });
}

export default async function ProfilPage(): Promise<React.JSX.Element> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);

  const [page, settings] = await Promise.all([
    Promise.allSettled([getPageBySlug("profil", siteKey)]).then((r) =>
      unwrapSettled(r[0], null)
    ),
    getSiteSettings(siteKey),
  ]);

  if (page?.is_active === false) {
    notFound();
  }

  const sections = [...(page?.sections ?? [])]
    .filter((s) => s.is_active !== false)
    .sort((a, b) => a.order - b.order);

  const heroSection = sections.find((s) => s.key === "hero");
  const strategySection = sections.find((s) => s.key === "strategi");
  const programSection = sections.find((s) => s.key === "program");
  const hasBothStrategyAndProgram = Boolean(strategySection && programSection);
  const otherSections = sections.filter((s) => s.key !== "hero");

  const siteTitle = settings.general?.site_title ?? config.name;
  const showKspMilestones = config.slug === "ksp";
  const firstTabSectionId = hasBothStrategyAndProgram
    ? otherSections.find((s) => s.key === "strategi" || s.key === "program")?.id
    : undefined;

  return (
    <div className="flex flex-col">
      <ProfileHero
        section={heroSection}
        siteTitle={siteTitle}
        badanHukum={settings.legal?.badan_hukum}
      />

      {otherSections.map((section, idx) => {
        if (section.key === "sejarah") {
          return (
            <ProfileHistory
              key={section.id}
              section={section}
              showKspMilestones={showKspMilestones}
            />
          );
        }

        if (isVisionMissionKey(section.key)) {
          return <ProfileVisionMission key={section.id} section={section} />;
        }

        if (section.key === "strategi" || section.key === "program") {
          if (hasBothStrategyAndProgram) {
            if (section.id !== firstTabSectionId) {
              return null;
            }
            return (
              <ProfileStrategyTabs
                key={`tabs-${section.id}`}
                strategySection={strategySection}
                programSection={programSection}
              />
            );
          }
          return <StrategyProgramSection key={section.id} section={section} />;
        }

        if (section.key === "about") {
          return <AboutStatsSection key={section.id} section={section} />;
        }

        if (section.key === "values") {
          return <DynamicSectionValues key={section.id} section={section} />;
        }

        if (section.key === "featured") {
          return <FeaturedProductsSection key={section.id} section={section} />;
        }

        if (section.key === "office") {
          return (
            <HeadOfficeSection
              key={section.id}
              section={section}
              contact={settings.contact}
              legal={settings.legal}
            />
          );
        }

        if (section.key === "cta") {
          return <CtaBannerSection key={section.id} section={section} />;
        }

        if (section.key === "instagram") {
          return <InstagramSection key={section.id} section={section} />;
        }

        return (
          <DynamicSectionGeneric key={section.id} section={section} index={idx} />
        );
      })}
    </div>
  );
}
