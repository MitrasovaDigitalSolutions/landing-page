import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { env } from "@/config/env";
import { resolveEffectiveModules, resolveSiteConfig } from "@/config/sites";
import { getPageBySlug } from "@/features/home/services/home.queries";
import { ContactHubSection } from "@/features/inquiry/components/contact-hub-section";
import { getSiteSettings } from "@/services/api/settings.service";
import { unwrapSettled } from "@/utils/promise";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const page = await getPageBySlug("kontak", siteKey).catch(() => null);

  return {
    title: page?.meta_title ?? page?.title ?? "Kontak",
    description: page?.meta_desc ?? undefined,
  };
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
      />
    </div>
  );
}
