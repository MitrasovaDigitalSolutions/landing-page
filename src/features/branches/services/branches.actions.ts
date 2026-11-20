"use server";

import {
  createBranch,
  deleteBranch,
  updateBranch,
} from "@/features/branches/services/branches.mutations";
import { ApiError } from "@/lib/api-error";
import { getAdminSession } from "@/lib/auth";
import { CACHE_TAGS, invalidateTags } from "@/lib/cache-tags";

export interface BranchActionResult {
  success: boolean;
  message: string;
}

export async function saveBranchAction(
  id: number | null,
  formData: FormData
): Promise<BranchActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    if (id) {
      await updateBranch(id, formData, session.accessToken);
    } else {
      await createBranch(formData, session.accessToken);
    }
    invalidateTags([CACHE_TAGS.branches()], ["/", "/admin/branches"]);
    return {
      success: true,
      message: id
        ? "Data cabang berhasil diperbarui!"
        : "Cabang berhasil ditambahkan!",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menyimpan data cabang.",
    };
  }
}

export async function deleteBranchAction(
  id: number
): Promise<BranchActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await deleteBranch(id, session.accessToken);
    invalidateTags([CACHE_TAGS.branches()], ["/", "/admin/branches"]);
    return { success: true, message: "Cabang berhasil dihapus!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menghapus cabang.",
    };
  }
}
