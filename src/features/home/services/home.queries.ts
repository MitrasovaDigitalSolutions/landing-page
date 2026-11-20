import { CACHE_TAGS } from "@/lib/cache-tags";
import { httpClient } from "@/lib/http-client";
import type { PageDetail } from "@/types/api.types";
import { cacheLife, cacheTag } from "next/cache";

export async function getPublicPages(siteKey?: string): Promise<PageDetail[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.pages(siteKey));

  const pages = await httpClient.get<PageDetail[]>("/pages", { siteKey });
  return Array.isArray(pages) ? pages : [];
}

export async function getPageBySlug(
  slug: string,
  siteKey?: string
): Promise<PageDetail> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.page(slug, siteKey), CACHE_TAGS.pages(siteKey));

  return httpClient.get<PageDetail>(`/pages/${slug}`, { siteKey });
}

export async function getHomePageDetail(siteKey?: string): Promise<PageDetail> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.page("home", siteKey), CACHE_TAGS.pages(siteKey));

  return httpClient.get<PageDetail>("/pages/home", { siteKey });
}
