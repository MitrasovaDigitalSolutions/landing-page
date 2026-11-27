import { isPublicPageVisible } from "@/config/navigation";
import { resolveEffectiveModules, resolveSiteConfig } from "@/config/sites";
import { httpClient } from "@/lib/http-client";
import { isIndexingEnabled, resolveSiteUrl } from "@/lib/seo";
import { getLiveSiteSettings } from "@/services/api/settings.service";
import type {
  Article,
  PageDetail,
  Partner,
  Portfolio,
  Service,
} from "@/types/api.types";

interface SitemapUrlEntry {
  loc: string;
  changefreq: "weekly" | "monthly";
  priority: string;
  lastmod?: string;
}

function escapeXml(raw: string): string {
  return raw
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function formatIsoLastMod(raw?: string | null): string | undefined {
  if (!raw) {
    return undefined;
  }
  const timestamp = Date.parse(raw);
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp).toISOString();
}

async function fetchLiveList<T>(
  endpoint: string,
  siteKey: string,
  params?: Record<string, string | number>
): Promise<T[]> {
  try {
    const items = await httpClient.get<T[]>(endpoint, {
      siteKey,
      cache: "no-store",
      params,
    });
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function serializeSitemapXml(entries: SitemapUrlEntry[]): string {
  const urlNodes = entries.map((entry) => {
    const lines = [
      "  <url>",
      `    <loc>${escapeXml(entry.loc)}</loc>`,
      ...(entry.lastmod ? [`    <lastmod>${entry.lastmod}</lastmod>`] : []),
      `    <changefreq>${entry.changefreq}</changefreq>`,
      `    <priority>${entry.priority}</priority>`,
      "  </url>",
    ];
    return lines.join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urlNodes,
    "</urlset>",
    "",
  ].join("\n");
}

export async function buildLiveSitemapXml(siteKey: string): Promise<string> {
  const settings = await getLiveSiteSettings(siteKey);
  if (!isIndexingEnabled(settings)) {
    return serializeSitemapXml([]);
  }

  const siteUrl = resolveSiteUrl(settings);
  const effectiveModules = resolveEffectiveModules(
    resolveSiteConfig(siteKey).modules,
    settings.modules?.is_active
  );

  const [pages, services, portfolios, articles, partners] = await Promise.all([
    fetchLiveList<PageDetail>("/pages", siteKey),
    effectiveModules.services
      ? fetchLiveList<Service>("/services", siteKey, { per_page: 200 })
      : Promise.resolve([]),
    effectiveModules.portfolios
      ? fetchLiveList<Portfolio>("/portfolios", siteKey)
      : Promise.resolve([]),
    effectiveModules.articles
      ? fetchLiveList<Article>("/articles", siteKey, { per_page: 200 })
      : Promise.resolve([]),
    fetchLiveList<Partner>("/partners", siteKey),
  ]);

  const entries: SitemapUrlEntry[] = [
    { loc: siteUrl, changefreq: "weekly", priority: "1.0" },
  ];
  const seenUrls = new Set<string>([siteUrl]);

  const pushEntry = (
    path: string,
    changefreq: "weekly" | "monthly",
    priority: string,
    lastmod?: string
  ): void => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const fullUrl = `${siteUrl}${cleanPath}`;
    if (seenUrls.has(fullUrl)) {
      return;
    }
    seenUrls.add(fullUrl);
    entries.push({ loc: fullUrl, changefreq, priority, lastmod });
  };

  for (const page of pages) {
    if (page.slug !== "home" && isPublicPageVisible(page, effectiveModules)) {
      pushEntry(`/${page.slug}`, "weekly", "0.8");
    }
  }

  for (const service of services) {
    if (service.is_active !== false && service.slug) {
      pushEntry(`/services/${service.slug}`, "weekly", "0.8");
    }
  }

  for (const portfolio of portfolios) {
    if (portfolio.slug) {
      pushEntry(
        `/portfolios/${portfolio.slug}`,
        "monthly",
        "0.7",
        formatIsoLastMod(portfolio.completion_date)
      );
    }
  }

  for (const article of articles) {
    if ((!article.status || article.status === "published") && article.slug) {
      pushEntry(
        `/articles/${article.slug}`,
        "weekly",
        "0.7",
        formatIsoLastMod(article.published_at)
      );
    }
  }

  for (const partner of partners) {
    pushEntry(`/mitra/${partner.id}`, "monthly", "0.6");
  }

  return serializeSitemapXml(entries);
}
