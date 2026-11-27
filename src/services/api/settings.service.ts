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

function coerceModuleBoolean(raw: unknown): boolean | undefined {
  if (typeof raw === "boolean") {
    return raw;
  }
  if (typeof raw === "number") {
    if (raw === 1) return true;
    if (raw === 0) return false;
    return undefined;
  }
  if (typeof raw === "string") {
    const normalized = raw.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
  }
  return undefined;
}

function extractModulesFlags(rawValue: unknown): SiteModulesActiveFlags {
  let candidate: unknown = rawValue;
  if (typeof candidate === "string") {
    try {
      candidate = JSON.parse(candidate) as unknown;
    } catch {
      return {};
    }
  }
  if (typeof candidate !== "object" || candidate === null || Array.isArray(candidate)) {
    return {};
  }
  const source = candidate as Record<string, unknown>;
  const flags: SiteModulesActiveFlags = {};

  for (const key of MODULE_FLAG_KEYS) {
    const parsed = coerceModuleBoolean(source[key]);
    if (typeof parsed === "boolean") {
      flags[key] = parsed;
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
        if (
          typeof item.key === "string" &&
          (typeof item.value === "string" || typeof item.value === "boolean")
        ) {
          result[item.key] = String(item.value);
        }
      }
    }
    return result;
  }

  if (typeof groupData === "object" && groupData !== null) {
    for (const [key, val] of Object.entries(groupData)) {
      if (typeof val === "string" || typeof val === "boolean") {
        result[key] = String(val);
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
