"use server";

import {
  createPartner,
  deletePartner,
  updatePartner,
} from "@/features/partners/services/partners.mutations";
import { ApiError } from "@/lib/api-error";
import { getAdminSession } from "@/lib/auth";
import { CACHE_TAGS, invalidateTags } from "@/lib/cache-tags";

export interface PartnerActionResult {
  success: boolean;
  message: string;
}

export async function savePartnerAction(
  id: number | null,
  formData: FormData
): Promise<PartnerActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    if (id) {
      await updatePartner(id, formData, session.accessToken);
    } else {
      await createPartner(formData, session.accessToken);
    }
    invalidateTags([CACHE_TAGS.partners()], ["/", "/admin/showcase"]);
    return {
      success: true,
      message: id
        ? "Data partner berhasil diperbarui!"
        : "Partner berhasil ditambahkan!",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menyimpan data partner.",
    };
  }
}

export async function deletePartnerAction(
  id: number
): Promise<PartnerActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await deletePartner(id, session.accessToken);
    invalidateTags([CACHE_TAGS.partners()], ["/", "/admin/showcase"]);
    return { success: true, message: "Partner berhasil dihapus!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menghapus partner.",
    };
  }
}
