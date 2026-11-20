import { CACHE_TAGS } from "@/lib/cache-tags";
import { httpClient } from "@/lib/http-client";
import type {
  SettingsBulkRequestPayload,
  SiteSettings,
} from "@/types/site-settings.types";
import { cacheLife, cacheTag } from "next/cache";

interface AdminSettingRow {
  key?: unknown;
  value?: unknown;
}

function normalizeSettingGroup(groupData: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (Array.isArray(groupData)) {
    for (const rawItem of groupData) {
      if (typeof rawItem === "object" && rawItem !== null) {
        const item = rawItem as AdminSettingRow;
        if (typeof item.key === "string" && typeof item.value === "string") {
          result[item.key] = item.value;
        }
      }
    }
    return result;
  }

  if (typeof groupData === "object" && groupData !== null) {
    for (const [key, val] of Object.entries(groupData)) {
      if (typeof val === "string") {
        result[key] = val;
      }
    }
  }
  return result;
}

function normalizeSettingsPayload(raw: unknown): SiteSettings {
  if (typeof raw !== "object" || raw === null) {
    return {};
  }
  const record = raw as Record<string, unknown>;
  const normalized: SiteSettings = {};

  for (const [groupKey, groupVal] of Object.entries(record)) {
    normalized[groupKey] = normalizeSettingGroup(groupVal);
  }
  return normalized;
}

export async function getSiteSettings(siteKey?: string): Promise<SiteSettings> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.settings(siteKey));

  try {
    const raw = await httpClient.get<unknown>("/settings", { siteKey });
    return normalizeSettingsPayload(raw);
  } catch {
    return {};
  }
}

export async function getAdminSettings(
  token: string,
  siteKey?: string
): Promise<SiteSettings> {
  try {
    const raw = await httpClient.get<unknown>("/admin/settings", {
      token,
      siteKey,
    });
    return normalizeSettingsPayload(raw);
  } catch {
    return {};
  }
}

export async function updateAdminSettings(
  payload: SettingsBulkRequestPayload,
  token: string,
  siteKey?: string
): Promise<{ success: boolean; message?: string }> {
  return httpClient.post<{ success: boolean; message?: string }>(
    "/admin/settings",
    payload,
    {
      token,
      siteKey,
    }
  );
}
