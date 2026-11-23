import { CACHE_TAGS } from "@/lib/cache-tags";
import { httpClient } from "@/lib/http-client";
import type { Portfolio } from "@/types/api.types";
import { cacheLife, cacheTag } from "next/cache";

export async function getPortfolios(siteKey?: string): Promise<Portfolio[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.portfolios(siteKey));

  return httpClient.get<Portfolio[]>("/portfolios", { siteKey });
}

export async function getPortfolioBySlug(
  slug: string,
  siteKey?: string
): Promise<Portfolio> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.portfolio(slug, siteKey), CACHE_TAGS.portfolios(siteKey));

  return httpClient.get<Portfolio>(`/portfolios/${slug}`, { siteKey });
}
