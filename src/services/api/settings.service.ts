import { CACHE_TAGS } from "@/lib/cache-tags";
import { httpClient } from "@/lib/http-client";
import type {
  SiteModulesActiveFlags,
  SiteModulesSettings,
  SiteSettings,
} from "@/types/site-settings.types";
import { cacheLife, cacheTag } from "next/cache";

interface RawSettingRow {
  key?: unknown;
  value?: unknown;
}

const MODULE_FLAG_KEYS: readonly (keyof SiteModulesActiveFlags)[] = [
  "services",
  "portfolios",
  "branches",
  "business_units",
  "careers",
  "news",
  "contact",
];

function extractModulesFlags(rawValue: unknown): SiteModulesActiveFlags {
  if (typeof rawValue !== "object" || rawValue === null) {
    return {};
  }
  const source = rawValue as Record<string, unknown>;
  const flags: SiteModulesActiveFlags = {};

  for (const key of MODULE_FLAG_KEYS) {
    if (typeof source[key] === "boolean") {
      flags[key] = source[key];
    }
  }
  return flags;
}

function normalizeModulesGroup(groupData: unknown): SiteModulesSettings {
  if (typeof groupData !== "object" || groupData === null) {
    return {};
  }

  if (Array.isArray(groupData)) {
    for (const rawItem of groupData) {
      if (typeof rawItem === "object" && rawItem !== null) {
        const row = rawItem as RawSettingRow;
        if (row.key === "is_active") {
          return { is_active: extractModulesFlags(row.value) };
        }
      }
    }
    return {};
  }

  const record = groupData as Record<string, unknown>;
  return record.is_active !== undefined
    ? { is_active: extractModulesFlags(record.is_active) }
    : {};
}

function normalizeSettingGroup(groupData: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (Array.isArray(groupData)) {
    for (const rawItem of groupData) {
      if (typeof rawItem === "object" && rawItem !== null) {
        const item = rawItem as RawSettingRow;
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
    normalized[groupKey] =
      groupKey === "modules"
        ? normalizeModulesGroup(groupVal)
        : normalizeSettingGroup(groupVal);
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
