import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { env } from "@/config/env";
import { resolveEffectiveModules, resolveSiteConfig } from "@/config/sites";
import { PublicBusinessUnitsGrid } from "@/features/business-units/components/public-business-units-grid";
import { getBusinessUnits } from "@/features/business-units/services/business-units.queries";
import { getPageBySlug } from "@/features/home/services/home.queries";
import { getSiteSettings } from "@/services/api/settings.service";
import { unwrapSettled } from "@/utils/promise";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const page = await getPageBySlug("unit-usaha", siteKey).catch(() => null);

  return {
    title: page?.meta_title ?? page?.title ?? "Unit Usaha",
    description: page?.meta_desc ?? undefined,
  };
}

export default async function UnitUsahaPage(): Promise<React.JSX.Element> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;

  const [page, units, settings] = await Promise.all([
    Promise.allSettled([getPageBySlug("unit-usaha", siteKey)]).then((r) =>
      unwrapSettled(r[0], null)
    ),
    Promise.allSettled([getBusinessUnits(siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    getSiteSettings(siteKey),
  ]);

  const effectiveModules = resolveEffectiveModules(
    resolveSiteConfig(siteKey).modules,
    settings.modules?.is_active
  );
  if (!effectiveModules.businessUnits || page?.is_active === false) {
    notFound();
  }

  const sections = (page?.sections ?? []).filter((s) => s.is_active !== false);
  const heroSection = sections.find((s) => s.key === "hero");
  const stats =
    units.length > 0
      ? [{ label: "Unit Usaha Aktif", value: String(units.length) }]
      : [];

  return (
    <div className="flex flex-col">
      <PageHero
        badge="Ekosistem Grup"
        title={heroSection?.title ?? page?.title ?? "Unit Usaha Kami"}
        description={heroSection?.body ?? page?.meta_desc}
        stats={stats}
      />
      <PublicBusinessUnitsGrid units={units} />
    </div>
  );
}
