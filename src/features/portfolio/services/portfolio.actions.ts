"use server";

import { getAdminSession } from "@/lib/auth";
import {
  createPortfolio,
  deletePortfolio,
  updatePortfolio,
} from "@/features/portfolio/services/portfolio.mutations";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS, invalidateTags } from "@/lib/cache-tags";

export interface PortfolioActionResult {
  success: boolean;
  message: string;
}

export async function savePortfolioAction(
  id: number | null,
  formData: FormData
): Promise<PortfolioActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    if (id) {
      await updatePortfolio(id, formData, session.accessToken);
    } else {
      await createPortfolio(formData, session.accessToken);
    }
    invalidateTags([CACHE_TAGS.portfolios()], ["/", "/admin/portfolios"]);
    return { success: true, message: "Portofolio berhasil disimpan!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menyimpan portofolio.",
    };
  }
}

export async function deletePortfolioAction(
  id: number
): Promise<PortfolioActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await deletePortfolio(id, session.accessToken);
    invalidateTags([CACHE_TAGS.portfolios()], ["/", "/admin/portfolios"]);
    return { success: true, message: "Portofolio berhasil dihapus!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menghapus portofolio.",
    };
  }
}
