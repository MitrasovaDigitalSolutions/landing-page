"use server";

import { env } from "@/config/env";
import { getAdminSession } from "@/lib/auth";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS, invalidateTags } from "@/lib/cache-tags";
import { updateAdminSettings } from "@/services/api/settings.service";
import type { SettingsBulkRequestPayload } from "@/types/site-settings.types";

export interface SettingsActionResult {
  success: boolean;
  message: string;
}

export async function saveAdminSettingsAction(
  payload: SettingsBulkRequestPayload
): Promise<SettingsActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return {
      success: false,
      message: "Sesi tidak valid. Silakan login kembali.",
    };
  }

  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  try {
    await updateAdminSettings(payload, session.accessToken, siteKey);
    invalidateTags([CACHE_TAGS.settings(siteKey)], ["/", "/admin/settings"]);
    return { success: true, message: "Pengaturan situs berhasil disimpan!" };
  } catch (error: unknown) {
    const message = ApiError.isApiError(error)
      ? error.message
      : "Gagal menyimpan pengaturan ke server.";
    return { success: false, message };
  }
}
