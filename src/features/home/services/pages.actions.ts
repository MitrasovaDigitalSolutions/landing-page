"use server";

import {
  addSection,
  createPage,
  deletePage,
  deleteSection,
  updatePage,
  updateSection,
} from "@/features/home/services/pages.mutations";
import { ApiError } from "@/lib/api-error";
import { getAdminSession } from "@/lib/auth";
import { CACHE_TAGS, invalidateTags } from "@/lib/cache-tags";

export interface PageActionResult {
  success: boolean;
  message: string;
}

function invalidatePageCaches(slug?: string, pageId?: number): void {
  const tags = [CACHE_TAGS.pages(), CACHE_TAGS.page("home")];
  if (slug && slug !== "home") {
    tags.push(CACHE_TAGS.page(slug));
  }

  const paths = ["/", "/admin/pages"];
  if (slug && slug !== "home") {
    paths.push(`/${slug}`);
  }
  if (pageId) {
    paths.push(`/admin/pages/${pageId}`);
  }

  invalidateTags(tags, paths);
}

export async function createPageAction(
  data: Record<string, unknown>
): Promise<PageActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await createPage(data, session.accessToken);
    const slug = typeof data.slug === "string" ? data.slug : undefined;
    invalidatePageCaches(slug);
    return { success: true, message: "Halaman baru berhasil dibuat!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal membuat halaman.",
    };
  }
}

export async function updatePageAction(
  id: number,
  data: Record<string, unknown>
): Promise<PageActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await updatePage(id, data, session.accessToken);
    const slug = typeof data.slug === "string" ? data.slug : undefined;
    invalidatePageCaches(slug, id);
    return { success: true, message: "Halaman berhasil diperbarui!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal memperbarui halaman.",
    };
  }
}

export async function deletePageAction(
  id: number,
  slug?: string
): Promise<PageActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await deletePage(id, session.accessToken);
    invalidatePageCaches(slug);
    return { success: true, message: "Halaman berhasil dihapus!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menghapus halaman.",
    };
  }
}

export async function saveSectionAction(
  pageId: number,
  sectionId: number | null,
  formData: FormData,
  pageSlug?: string
): Promise<PageActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    if (sectionId) {
      await updateSection(sectionId, formData, session.accessToken);
    } else {
      await addSection(pageId, formData, session.accessToken);
    }
    invalidatePageCaches(pageSlug, pageId);
    return { success: true, message: "Section berhasil disimpan!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menyimpan section.",
    };
  }
}

export async function saveSectionJsonAction(
  pageId: number,
  sectionId: number | null,
  data: Record<string, unknown>,
  pageSlug?: string
): Promise<PageActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    if (sectionId) {
      await updateSection(sectionId, data, session.accessToken);
    } else {
      await addSection(pageId, data, session.accessToken);
    }
    invalidatePageCaches(pageSlug, pageId);
    return { success: true, message: "Section berhasil disimpan!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menyimpan section.",
    };
  }
}

export async function deleteSectionAction(
  id: number,
  pageId?: number,
  pageSlug?: string
): Promise<PageActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await deleteSection(id, session.accessToken);
    invalidatePageCaches(pageSlug, pageId);
    return { success: true, message: "Section berhasil dihapus!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menghapus section.",
    };
  }
}
