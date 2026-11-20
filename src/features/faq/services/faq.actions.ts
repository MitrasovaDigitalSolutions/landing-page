"use server";

import { getAdminSession } from "@/lib/auth";
import {
  createFaq,
  createFaqCategory,
  deleteFaq,
  deleteFaqCategory,
  updateFaq,
  updateFaqCategory,
} from "@/features/faq/services/faq.mutations";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS, invalidateTags } from "@/lib/cache-tags";

export interface FaqActionResult {
  success: boolean;
  message: string;
}

export async function saveFaqCategoryAction(
  id: number | null,
  data: Record<string, unknown>
): Promise<FaqActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    if (id) {
      await updateFaqCategory(id, data, session.accessToken);
    } else {
      await createFaqCategory(data, session.accessToken);
    }
    invalidateTags([CACHE_TAGS.faqs()], ["/", "/admin/faqs"]);
    return { success: true, message: "Kategori FAQ berhasil disimpan!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menyimpan kategori FAQ.",
    };
  }
}

export async function deleteFaqCategoryAction(
  id: number
): Promise<FaqActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await deleteFaqCategory(id, session.accessToken);
    invalidateTags([CACHE_TAGS.faqs()], ["/", "/admin/faqs"]);
    return { success: true, message: "Kategori FAQ berhasil dihapus!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menghapus kategori FAQ.",
    };
  }
}

export async function saveFaqAction(
  id: number | null,
  data: Record<string, unknown>
): Promise<FaqActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    if (id) {
      await updateFaq(id, data, session.accessToken);
    } else {
      await createFaq(data, session.accessToken);
    }
    invalidateTags([CACHE_TAGS.faqs()], ["/", "/admin/faqs"]);
    return { success: true, message: "FAQ berhasil disimpan!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menyimpan FAQ.",
    };
  }
}

export async function deleteFaqAction(id: number): Promise<FaqActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await deleteFaq(id, session.accessToken);
    invalidateTags([CACHE_TAGS.faqs()], ["/", "/admin/faqs"]);
    return { success: true, message: "FAQ berhasil dihapus!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menghapus FAQ.",
    };
  }
}
