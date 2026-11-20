"use server";

import type {
  ManagedSite,
  ManagedUser,
  SiteFormData,
  UserFormData,
} from "@/features/auth/types/user-management.types";
import { ApiError } from "@/lib/api-error";
import { getAdminSession } from "@/lib/auth";
import { httpClient } from "@/lib/http-client";
import { revalidatePath } from "next/cache";

export interface UserActionResult {
  success: boolean;
  message: string;
}

export async function createUserAction(
  data: UserFormData
): Promise<UserActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await httpClient.post<ManagedUser>("/admin/users", data, {
      token: session.accessToken,
    });
    revalidatePath("/admin/users");
    return { success: true, message: "Pengguna berhasil ditambahkan!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menambahkan pengguna baru.",
    };
  }
}

export async function updateUserAction(
  id: number,
  data: UserFormData
): Promise<UserActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await httpClient.put<ManagedUser>(`/admin/users/${id}`, data, {
      token: session.accessToken,
    });
    revalidatePath("/admin/users");
    return { success: true, message: "Data pengguna berhasil diperbarui!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal memperbarui pengguna.",
    };
  }
}

export async function assignUserToSiteAction(
  siteId: string,
  userId: number,
  role: "admin" | "editor"
): Promise<UserActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await httpClient.post(
      `/admin/sites/${siteId}/users`,
      { user_id: userId, role },
      { token: session.accessToken }
    );
    revalidatePath("/admin/users");
    return { success: true, message: "Hak akses site berhasil ditetapkan!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menetapkan akses site.",
    };
  }
}

export async function detachUserFromSiteAction(
  siteId: string,
  userId: number
): Promise<UserActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await httpClient.delete(`/admin/sites/${siteId}/users/${userId}`, {
      token: session.accessToken,
    });
    revalidatePath("/admin/users");
    return { success: true, message: "Akses user dari site berhasil dilepas!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal melepas akses user dari site.",
    };
  }
}

export async function createSiteAction(
  data: SiteFormData
): Promise<UserActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await httpClient.post<ManagedSite>("/admin/sites", data, {
      token: session.accessToken,
    });
    revalidatePath("/admin/users");
    return { success: true, message: "Unit usaha (site) berhasil dibuat!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal membuat unit usaha baru.",
    };
  }
}

export async function updateSiteAction(
  id: string,
  data: SiteFormData
): Promise<UserActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await httpClient.put<ManagedSite>(`/admin/sites/${id}`, data, {
      token: session.accessToken,
    });
    revalidatePath("/admin/users");
    return { success: true, message: "Unit usaha (site) berhasil diperbarui!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal memperbarui unit usaha.",
    };
  }
}

export async function deleteSiteAction(id: string): Promise<UserActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await httpClient.delete(`/admin/sites/${id}`, {
      token: session.accessToken,
    });
    revalidatePath("/admin/users");
    return { success: true, message: "Unit usaha (site) berhasil dihapus!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menghapus site. Pastikan site tidak memiliki konten aktif.",
    };
  }
}
