"use server";

import {
  createArticle,
  createArticleCategory,
  deleteArticle,
  deleteArticleCategory,
  updateArticle,
  updateArticleCategory,
} from "@/features/articles/services/articles.mutations";
import { getAdminSession } from "@/lib/auth";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS, invalidateTags } from "@/lib/cache-tags";

export interface ArticleActionResult {
  success: boolean;
  message: string;
}

export async function saveArticleCategoryAction(
  id: number | null,
  data: Record<string, unknown>
): Promise<ArticleActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    if (id) {
      await updateArticleCategory(id, data, session.accessToken);
    } else {
      await createArticleCategory(data, session.accessToken);
    }
    invalidateTags(
      [CACHE_TAGS.articleCategories(), CACHE_TAGS.articles()],
      ["/", "/admin/articles"]
    );
    return { success: true, message: "Kategori artikel berhasil disimpan!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menyimpan kategori artikel.",
    };
  }
}

export async function deleteArticleCategoryAction(
  id: number
): Promise<ArticleActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await deleteArticleCategory(id, session.accessToken);
    invalidateTags(
      [CACHE_TAGS.articleCategories(), CACHE_TAGS.articles()],
      ["/", "/admin/articles"]
    );
    return { success: true, message: "Kategori artikel berhasil dihapus!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menghapus kategori artikel.",
    };
  }
}

export async function saveArticleAction(
  id: number | null,
  formData: FormData
): Promise<ArticleActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    if (id) {
      await updateArticle(id, formData, session.accessToken);
    } else {
      await createArticle(formData, session.accessToken);
    }
    invalidateTags(
      [CACHE_TAGS.articles(), CACHE_TAGS.articleCategories()],
      ["/", "/admin/articles"]
    );
    return { success: true, message: "Artikel berhasil disimpan!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menyimpan artikel.",
    };
  }
}

export async function deleteArticleAction(
  id: number
): Promise<ArticleActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await deleteArticle(id, session.accessToken);
    invalidateTags(
      [CACHE_TAGS.articles(), CACHE_TAGS.articleCategories()],
      ["/", "/admin/articles"]
    );
    return { success: true, message: "Artikel berhasil dihapus!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menghapus artikel.",
    };
  }
}
