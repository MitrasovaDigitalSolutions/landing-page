import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { env } from "@/config/env";
import { resolveEffectiveModules, resolveSiteConfig } from "@/config/sites";
import { ArticlesSection } from "@/features/articles/components/articles-section";
import { InstagramFeedSection } from "@/features/articles/components/instagram-feed-section";
import {
  getArticleCategories,
  getArticles,
} from "@/features/articles/services/articles.queries";
import { getInstagramLiveMedia } from "@/features/articles/services/instagram.service";
import { getPageBySlug } from "@/features/home/services/home.queries";
import { getSiteSettings } from "@/services/api/settings.service";
import { unwrapSettled } from "@/utils/promise";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const page = await getPageBySlug("berita", siteKey).catch(() => null);

  return {
    title: page?.meta_title ?? page?.title ?? "Artikel & Berita",
    description: page?.meta_desc ?? undefined,
  };
}

export default async function BeritaPage(): Promise<React.JSX.Element> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;

  const [page, articles, categories, livePosts, settings] = await Promise.all([
    Promise.allSettled([getPageBySlug("berita", siteKey)]).then((r) =>
      unwrapSettled(r[0], null)
    ),
    Promise.allSettled([getArticles(undefined, siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    Promise.allSettled([getArticleCategories(siteKey)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    Promise.allSettled([getInstagramLiveMedia(6)]).then((r) =>
      unwrapSettled(r[0], [])
    ),
    getSiteSettings(siteKey),
  ]);

  const effectiveModules = resolveEffectiveModules(
    resolveSiteConfig(siteKey).modules,
    settings.modules?.is_active
  );
  if (!effectiveModules.articles || page?.is_active === false) {
    notFound();
  }

  const sections = (page?.sections ?? []).filter((s) => s.is_active !== false);
  const heroSection = sections.find((s) => s.key === "hero");
  const instagramSection = sections.find((s) => s.key === "instagram");

  return (
    <div className="flex flex-col">
      <PageHero
        badge="Informasi & Publikasi"
        title={heroSection?.title ?? page?.title ?? "Artikel & Berita"}
        description={heroSection?.body ?? page?.meta_desc}
      />
      <ArticlesSection articles={articles} categories={categories} />
      <InstagramFeedSection section={instagramSection} livePosts={livePosts} />
    </div>
  );
}
