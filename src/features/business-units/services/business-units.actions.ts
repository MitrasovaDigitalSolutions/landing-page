"use server";

import {
  createBusinessUnit,
  deleteBusinessUnit,
  updateBusinessUnit,
} from "@/features/business-units/services/business-units.mutations";
import { ApiError } from "@/lib/api-error";
import { getAdminSession } from "@/lib/auth";
import { CACHE_TAGS, invalidateTags } from "@/lib/cache-tags";

export interface BusinessUnitActionResult {
  success: boolean;
  message: string;
}

export async function saveBusinessUnitAction(
  id: number | null,
  formData: FormData
): Promise<BusinessUnitActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    if (id) {
      await updateBusinessUnit(id, formData, session.accessToken);
    } else {
      await createBusinessUnit(formData, session.accessToken);
    }
    invalidateTags([CACHE_TAGS.businessUnits()], ["/", "/admin/business-units"]);
    return {
      success: true,
      message: id
        ? "Unit usaha berhasil diperbarui!"
        : "Unit usaha berhasil ditambahkan!",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menyimpan unit usaha.",
    };
  }
}

export async function deleteBusinessUnitAction(
  id: number
): Promise<BusinessUnitActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await deleteBusinessUnit(id, session.accessToken);
    invalidateTags([CACHE_TAGS.businessUnits()], ["/", "/admin/business-units"]);
    return { success: true, message: "Unit usaha berhasil dihapus!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menghapus unit usaha.",
    };
  }
}
