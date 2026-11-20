import { httpClient } from "@/lib/http-client";
import type { Article, ArticleCategory } from "@/types/api.types";

export async function createArticleCategory(
  data: Record<string, unknown>,
  token: string
): Promise<ArticleCategory> {
  return httpClient.post<ArticleCategory>(
    "/admin/article-categories",
    data,
    { token }
  );
}

export async function updateArticleCategory(
  id: number,
  data: Record<string, unknown>,
  token: string
): Promise<ArticleCategory> {
  return httpClient.put<ArticleCategory>(
    `/admin/article-categories/${id}`,
    data,
    { token }
  );
}

export async function deleteArticleCategory(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  return httpClient.delete<{ success: boolean }>(
    `/admin/article-categories/${id}`,
    { token }
  );
}

export async function createArticle(
  data: FormData | Record<string, unknown>,
  token: string
): Promise<Article> {
  return httpClient.post<Article>("/admin/articles", data, { token });
}

export async function updateArticle(
  id: number,
  data: FormData | Record<string, unknown>,
  token: string
): Promise<Article> {
  return httpClient.put<Article>(`/admin/articles/${id}`, data, { token });
}

export async function deleteArticle(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  return httpClient.delete<{ success: boolean }>(`/admin/articles/${id}`, {
    token,
  });
}
