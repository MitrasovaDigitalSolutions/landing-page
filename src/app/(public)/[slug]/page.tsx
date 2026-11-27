import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "@/config/env";
import { isSlugAllowedByModules } from "@/config/navigation";
import { resolveEffectiveModules, resolveSiteConfig } from "@/config/sites";
import { DynamicPageRenderer } from "@/features/home/components/dynamic-page-renderer";
import { getPageBySlug } from "@/features/home/services/home.queries";
import { getServices } from "@/features/services/services/services.queries";
import { buildPageMetadata, resolveSiteUrl } from "@/lib/seo";
import { getSiteSettings } from "@/services/api/settings.service";

export const instant = false;

interface DynamicSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DynamicSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);
  const [page, settings] = await Promise.all([
    getPageBySlug(slug, siteKey).catch(() => null),
    getSiteSettings(siteKey),
  ]);

  return buildPageMetadata({
    title: page?.meta_title ?? page?.title ?? "Halaman",
    description: page?.meta_desc,
    path: `/${slug}`,
    siteUrl: resolveSiteUrl(settings),
    config,
    settings,
  });
}

export default async function DynamicPublicPage({
  params,
}: DynamicSlugPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;

  const [page, settings] = await Promise.all([
    getPageBySlug(slug, siteKey).catch(() => null),
    getSiteSettings(siteKey),
  ]);

  const effectiveModules = resolveEffectiveModules(
    resolveSiteConfig(siteKey).modules,
    settings.modules?.is_active
  );

  if (
    !isSlugAllowedByModules(slug, effectiveModules) ||
    !page ||
    page.is_published === false ||
    page.is_active === false
  ) {
    notFound();
  }

  const hasFeatured = Boolean(
    page.sections?.some((s) => s.is_active !== false && s.key === "featured")
  );
  const services =
    effectiveModules.services && hasFeatured
      ? await getServices(undefined, siteKey).catch(() => [])
      : [];

  return (
    <DynamicPageRenderer
      page={page}
      services={services}
      contact={settings.contact}
      legal={settings.legal}
    />
  );
}
