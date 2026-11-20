"use server";

import { getAdminSession } from "@/lib/auth";
import {
  createService,
  createServiceType,
  deleteService,
  deleteServiceType,
  updateService,
  updateServiceType,
} from "@/features/services/services/services.mutations";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS, invalidateTags } from "@/lib/cache-tags";

export interface ServiceActionResult {
  success: boolean;
  message: string;
}

export async function saveServiceTypeAction(
  id: number | null,
  data: Record<string, unknown>
): Promise<ServiceActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    if (id) {
      await updateServiceType(id, data, session.accessToken);
    } else {
      await createServiceType(data, session.accessToken);
    }
    invalidateTags(
      [CACHE_TAGS.serviceTypes(), CACHE_TAGS.services()],
      ["/", "/admin/services"]
    );
    return { success: true, message: "Tipe layanan berhasil disimpan!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menyimpan tipe layanan.",
    };
  }
}

export async function deleteServiceTypeAction(
  id: number
): Promise<ServiceActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await deleteServiceType(id, session.accessToken);
    invalidateTags(
      [CACHE_TAGS.serviceTypes(), CACHE_TAGS.services()],
      ["/", "/admin/services"]
    );
    return { success: true, message: "Tipe layanan berhasil dihapus!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menghapus tipe layanan. Pastikan tidak ada layanan yang terhubung.",
    };
  }
}

export async function saveServiceAction(
  id: number | null,
  formData: FormData
): Promise<ServiceActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    if (id) {
      await updateService(id, formData, session.accessToken);
    } else {
      await createService(formData, session.accessToken);
    }
    invalidateTags(
      [CACHE_TAGS.services(), CACHE_TAGS.serviceTypes()],
      ["/", "/admin/services"]
    );
    return { success: true, message: "Layanan berhasil disimpan!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menyimpan layanan.",
    };
  }
}

export async function deleteServiceAction(
  id: number
): Promise<ServiceActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await deleteService(id, session.accessToken);
    invalidateTags(
      [CACHE_TAGS.services(), CACHE_TAGS.serviceTypes()],
      ["/", "/admin/services"]
    );
    return { success: true, message: "Layanan berhasil dihapus!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menghapus layanan.",
    };
  }
}
