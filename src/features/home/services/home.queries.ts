import { CACHE_TAGS } from "@/lib/cache-tags";
import { httpClient } from "@/lib/http-client";
import type { PageDetail } from "@/types/api.types";
import { cacheLife, cacheTag } from "next/cache";

export async function getPublicPages(siteKey?: string): Promise<PageDetail[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.pages(siteKey));

  try {
    const pages = await httpClient.get<PageDetail[]>("/pages", { siteKey });
    return Array.isArray(pages) ? pages : [];
  } catch {
    return [];
  }
}

export async function getPageBySlug(
  slug: string,
  siteKey?: string
): Promise<PageDetail | null> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.page(slug, siteKey), CACHE_TAGS.pages(siteKey));

  try {
    return await httpClient.get<PageDetail>(`/pages/${slug}`, { siteKey });
  } catch {
    return null;
  }
}

export async function getHomePageDetail(
  siteKey?: string
): Promise<PageDetail | null> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.page("home", siteKey), CACHE_TAGS.pages(siteKey));

  try {
    return await httpClient.get<PageDetail>("/pages/home", { siteKey });
  } catch {
    return null;
  }
}
