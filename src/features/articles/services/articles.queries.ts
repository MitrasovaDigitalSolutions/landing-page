import { CACHE_TAGS } from "@/lib/cache-tags";
import { httpClient } from "@/lib/http-client";
import type { Article, ArticleCategory } from "@/types/api.types";
import { cacheLife, cacheTag } from "next/cache";

export async function getArticleCategories(
  siteKey?: string
): Promise<ArticleCategory[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.articleCategories(siteKey));

  try {
    return await httpClient.get<ArticleCategory[]>("/article-categories", {
      siteKey,
    });
  } catch {
    return [];
  }
}

export async function getArticles(
  categorySlug?: string,
  siteKey?: string
): Promise<Article[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.articles(siteKey));

  try {
    return await httpClient.get<Article[]>("/articles", {
      siteKey,
      params: categorySlug ? { category: categorySlug } : undefined,
    });
  } catch {
    return [];
  }
}

export async function getArticleBySlug(
  slug: string,
  siteKey?: string
): Promise<Article | null> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.article(slug, siteKey), CACHE_TAGS.articles(siteKey));

  try {
    return await httpClient.get<Article>(`/articles/${slug}`, { siteKey });
  } catch {
    return null;
  }
}
