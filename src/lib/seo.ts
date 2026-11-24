import type { Metadata } from "next";
import { env } from "@/config/env";
import type { SiteConfig } from "@/types/site.types";
import type { SiteSettings } from "@/types/site-settings.types";
import { resolveMediaUrl } from "@/utils/media";

function normalizeOriginUrl(rawUrl?: string | null): string | null {
  if (!rawUrl) {
    return null;
  }
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.origin;
  } catch {
    return null;
  }
}

export function pickNonEmptyText(
  ...candidates: (string | null | undefined)[]
): string | undefined {
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return undefined;
}

export function resolveSiteUrl(settings?: SiteSettings): string {
  const fromPortal = normalizeOriginUrl(settings?.seo?.canonical_domain);
  if (fromPortal) {
    return fromPortal;
  }

  const fromEnv = normalizeOriginUrl(env.NEXT_PUBLIC_SITE_URL);
  if (fromEnv) {
    return fromEnv;
  }

  const fromVercelProd = normalizeOriginUrl(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  );
  if (fromVercelProd) {
    return fromVercelProd;
  }

  const fromVercelPreview = normalizeOriginUrl(process.env.VERCEL_URL);
  if (fromVercelPreview) {
    return fromVercelPreview;
  }

  return "http://localhost:3000";
}

export function toAbsoluteSiteUrl(
  pathOrUrl: string | null | undefined,
  siteUrl: string
): string | undefined {
  if (!pathOrUrl) {
    return undefined;
  }
  const trimmed = pathOrUrl.trim();
  if (!trimmed) {
    return undefined;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${siteUrl}${cleanPath}`;
}

export function resolveSiteFaviconUrl(settings?: SiteSettings): string | null {
  return (
    resolveMediaUrl(
      settings?.general?.favicon_url,
      settings?.general?.favicon_path
    ) ??
    resolveMediaUrl(
      settings?.general?.logo_url,
      settings?.general?.logo_path
    ) ??
    null
  );
}

export function buildSiteIcons(faviconUrl: string | null): Metadata["icons"] {
  if (faviconUrl) {
    return {
      icon: [{ url: faviconUrl }],
      shortcut: [faviconUrl],
      apple: [{ url: faviconUrl }],
    };
  }

  return {
    icon: [{ url: "/favicon.ico" }],
    shortcut: ["/favicon.ico"],
  };
}

export function parseCommaList(raw?: string): string[] {
  if (!raw) {
    return [];
  }
  const items: string[] = [];
  for (const part of raw.split(",")) {
    const trimmed = part.trim();
    if (trimmed && !items.includes(trimmed)) {
      items.push(trimmed);
    }
  }
  return items;
}

export function isIndexingEnabled(settings?: SiteSettings): boolean {
  const flag = settings?.seo?.robots_index;
  return flag !== false && flag !== "false";
}

export interface BuildPageMetadataOptions {
  title: string;
  description?: string | null;
  path: string;
  siteUrl: string;
  config: SiteConfig;
  settings?: SiteSettings;
  imagePathOrUrl?: string | null;
  type?: "website" | "article";
  publishedTime?: string | null;
}

export function buildPageMetadata({
  title,
  description,
  path,
  siteUrl,
  config,
  settings,
  imagePathOrUrl,
  type = "website",
  publishedTime,
}: BuildPageMetadataOptions): Metadata {
  const siteName = pickNonEmptyText(settings?.general?.site_title) ?? config.name;
  const resolvedDesc =
    pickNonEmptyText(
      description,
      settings?.seo?.meta_description,
      settings?.general?.tagline
    ) ?? `Informasi layanan dan profil resmi ${siteName}.`;

  const resolvedMedia =
    toAbsoluteSiteUrl(imagePathOrUrl, siteUrl) ??
    toAbsoluteSiteUrl(
      resolveMediaUrl(
        settings?.general?.logo_url,
        settings?.general?.logo_path
      ),
      siteUrl
    );

  const canonicalUrl = toAbsoluteSiteUrl(path, siteUrl) ?? siteUrl;

  return {
    title,
    description: resolvedDesc,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "id_ID",
      url: canonicalUrl,
      siteName,
      title,
      description: resolvedDesc,
      ...(publishedTime ? { publishedTime } : {}),
      ...(resolvedMedia ? { images: [{ url: resolvedMedia, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: resolvedDesc,
      ...(resolvedMedia ? { images: [resolvedMedia] } : {}),
    },
  };
}
