import { env } from "@/config/env";
import { revalidatePath, updateTag } from "next/cache";

function resolveKey(siteKey?: string): string {
  return siteKey ?? env.NEXT_PUBLIC_SITE_KEY;
}

export const CACHE_TAGS = {
  settings: (siteKey?: string): string => `site:${resolveKey(siteKey)}:settings`,
  pages: (siteKey?: string): string => `site:${resolveKey(siteKey)}:pages`,
  page: (slug: string, siteKey?: string): string =>
    `site:${resolveKey(siteKey)}:page:${slug}`,
  serviceTypes: (siteKey?: string): string =>
    `site:${resolveKey(siteKey)}:service-types`,
  services: (siteKey?: string): string => `site:${resolveKey(siteKey)}:services`,
  service: (slug: string, siteKey?: string): string =>
    `site:${resolveKey(siteKey)}:service:${slug}`,
  portfolios: (siteKey?: string): string =>
    `site:${resolveKey(siteKey)}:portfolios`,
  portfolio: (slug: string, siteKey?: string): string =>
    `site:${resolveKey(siteKey)}:portfolio:${slug}`,
  articleCategories: (siteKey?: string): string =>
    `site:${resolveKey(siteKey)}:article-categories`,
  articles: (siteKey?: string): string => `site:${resolveKey(siteKey)}:articles`,
  article: (slug: string, siteKey?: string): string =>
    `site:${resolveKey(siteKey)}:article:${slug}`,
  faqs: (siteKey?: string): string => `site:${resolveKey(siteKey)}:faqs`,
  testimonials: (siteKey?: string): string =>
    `site:${resolveKey(siteKey)}:testimonials`,
  partners: (siteKey?: string): string => `site:${resolveKey(siteKey)}:partners`,
  branches: (siteKey?: string): string => `site:${resolveKey(siteKey)}:branches`,
  businessUnits: (siteKey?: string): string =>
    `site:${resolveKey(siteKey)}:business-units`,
};

export function invalidateTags(tags: string[], paths: string[] = ["/"]): void {
  for (const tag of tags) {
    updateTag(tag);
  }
  for (const path of paths) {
    revalidatePath(path, "layout");
  }
}
