import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { env } from "@/config/env";
import { resolveEffectiveModules, resolveSiteConfig } from "@/config/sites";
import { getPageBySlug } from "@/features/home/services/home.queries";
import { getBranches } from "@/features/branches/services/branches.queries";
import { ContactHubSection } from "@/features/inquiry/components/contact-hub-section";
import { buildPageMetadata, resolveSiteUrl } from "@/lib/seo";
import { getSiteSettings } from "@/services/api/settings.service";
import { unwrapSettled } from "@/utils/promise";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);
  const [page, settings] = await Promise.all([
    getPageBySlug("kontak", siteKey).catch(() => null),
    getSiteSettings(siteKey),
  ]);

  return buildPageMetadata({
    title: page?.meta_title ?? page?.title ?? "Kontak",
    description: page?.meta_desc,
    path: "/kontak",
    siteUrl: resolveSiteUrl(settings),
    config,
    settings,
  });
}

export default async function KontakPage(): Promise<React.JSX.Element> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;

  const [page, settings] = await Promise.all([
    Promise.allSettled([getPageBySlug("kontak", siteKey)]).then((r) =>
      unwrapSettled(r[0], null)
    ),
    getSiteSettings(siteKey),
  ]);

  const effectiveModules = resolveEffectiveModules(
    resolveSiteConfig(siteKey).modules,
    settings.modules?.is_active
  );
  if (!effectiveModules.contact || page?.is_active === false) {
    notFound();
  }

  const branches = effectiveModules.branches
    ? await getBranches(siteKey).catch(() => [])
    : [];
  const siteName =
    settings.general?.site_title ?? resolveSiteConfig(siteKey).name;
  const siteUrl = resolveSiteUrl(settings);

  const sections = (page?.sections ?? []).filter((s) => s.is_active !== false);
  const heroSection = sections.find((s) => s.key === "hero");

  return (
    <div className="flex flex-col">
      <PageHero
        badge="Layanan Anggota"
        title={heroSection?.title ?? page?.title ?? "Hubungi Kami"}
        description={heroSection?.body ?? page?.meta_desc}
      />
      <ContactHubSection
        contact={settings.contact}
        legal={settings.legal}
        showHeading={false}
        branches={branches}
        siteName={siteName}
        siteUrl={siteUrl}
      />
    </div>
  );
}
