import { env } from "@/config/env";
import { isPublicPageVisible } from "@/config/navigation";
import { resolveEffectiveModules, resolveSiteConfig } from "@/config/sites";
import { getArticles } from "@/features/articles/services/articles.queries";
import { getPublicPages } from "@/features/home/services/home.queries";
import { getPortfolios } from "@/features/portfolio/services/portfolio.queries";
import { getServices } from "@/features/services/services/services.queries";
import { isIndexingEnabled, resolveSiteUrl } from "@/lib/seo";
import { getSiteSettings } from "@/services/api/settings.service";
import type { MetadataRoute } from "next";

function parseValidDate(raw?: string | null): Date | undefined {
  if (!raw) {
    return undefined;
  }
  const timestamp = Date.parse(raw);
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const settings = await getSiteSettings(siteKey);
  if (!isIndexingEnabled(settings)) {
    return [];
  }

  const siteUrl = resolveSiteUrl(settings);
  const effectiveModules = resolveEffectiveModules(
    resolveSiteConfig(siteKey).modules,
    settings.modules?.is_active
  );

  const [pages, services, portfolios, articles] = await Promise.all([
    getPublicPages(siteKey),
    effectiveModules.services ? getServices(undefined, siteKey) : Promise.resolve([]),
    effectiveModules.portfolios ? getPortfolios(siteKey) : Promise.resolve([]),
    effectiveModules.articles ? getArticles(undefined, siteKey) : Promise.resolve([]),
  ]);

  const entries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
  ];

  const seenUrls = new Set<string>([siteUrl]);
  const pushEntry = (
    path: string,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: number,
    lastModified?: Date
  ): void => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const fullUrl = `${siteUrl}${cleanPath}`;
    if (seenUrls.has(fullUrl)) {
      return;
    }
    seenUrls.add(fullUrl);
    entries.push({
      url: fullUrl,
      changeFrequency,
      priority,
      ...(lastModified ? { lastModified } : {}),
    });
  };

  for (const page of pages) {
    if (page.slug !== "home" && isPublicPageVisible(page, effectiveModules)) {
      pushEntry(`/${page.slug}`, "weekly", 0.8);
    }
  }

  for (const service of services) {
    if (service.is_active !== false && service.slug) {
      pushEntry(`/services/${service.slug}`, "weekly", 0.8);
    }
  }

  for (const portfolio of portfolios) {
    if (portfolio.slug) {
      pushEntry(
        `/portfolios/${portfolio.slug}`,
        "monthly",
        0.7,
        parseValidDate(portfolio.completion_date)
      );
    }
  }

  for (const article of articles) {
    if ((!article.status || article.status === "published") && article.slug) {
      pushEntry(
        `/articles/${article.slug}`,
        "weekly",
        0.7,
        parseValidDate(article.published_at)
      );
    }
  }

  return entries;
}
