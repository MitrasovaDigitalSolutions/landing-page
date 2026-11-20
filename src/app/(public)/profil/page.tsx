import type { Metadata } from "next";
import { env } from "@/config/env";
import { resolveSiteConfig } from "@/config/sites";
import { getPageBySlug } from "@/features/home/services/home.queries";
import { ProfileHero } from "@/features/profile/components/profile-hero";
import { ProfileHistory } from "@/features/profile/components/profile-history";
import { ProfileStrategyTabs } from "@/features/profile/components/profile-strategy-tabs";
import { ProfileVisionMission } from "@/features/profile/components/profile-vision-mission";
import { getSiteSettings } from "@/services/api/settings.service";
import { unwrapSettled } from "@/utils/promise";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const page = await getPageBySlug("profil", siteKey).catch(() => null);

  return {
    title: page?.meta_title ?? page?.title ?? "Profil",
    description: page?.meta_desc ?? undefined,
  };
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

  const sections = page?.sections ?? [];
  const heroSection = sections.find((s) => s.key === "hero");
  const historySection = sections.find((s) => s.key === "sejarah");
  const visionSection = sections.find((s) => s.key === "visi-misi");
  const strategySection = sections.find((s) => s.key === "strategi");
  const programSection = sections.find((s) => s.key === "program");

  const siteTitle = settings.general?.site_title ?? config.name;

  return (
    <div className="flex flex-col">
      <ProfileHero
        section={heroSection}
        siteTitle={siteTitle}
        badanHukum={settings.legal?.badan_hukum}
      />
      <ProfileHistory section={historySection} />
      <ProfileVisionMission section={visionSection} />
      <ProfileStrategyTabs
        strategySection={strategySection}
        programSection={programSection}
      />
    </div>
  );
}
