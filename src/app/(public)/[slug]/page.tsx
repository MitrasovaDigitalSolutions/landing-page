import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "@/config/env";
import { resolveEffectiveModules, resolveSiteConfig } from "@/config/sites";
import { DynamicPageRenderer } from "@/features/home/components/dynamic-page-renderer";
import { getPageBySlug } from "@/features/home/services/home.queries";
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
    (slug === "karir" && !effectiveModules.careers) ||
    !page ||
    page.is_published === false ||
    page.is_active === false
  ) {
    notFound();
  }

  return <DynamicPageRenderer page={page} />;
}
