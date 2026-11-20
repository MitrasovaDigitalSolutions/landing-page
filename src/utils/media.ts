import { env } from "@/config/env";

function getApiOrigin(): string {
  try {
    const parsed = new URL(env.NEXT_PUBLIC_API_URL);
    return parsed.origin;
  } catch {
    return "http://43.157.197.42:8088";
  }
}

function isInvalidValue(value?: string | null): boolean {
  if (!value) {
    return true;
  }
  const trimmed = value.trim().toLowerCase();
  return (
    trimmed.length === 0 ||
    trimmed === "string" ||
    trimmed === "null" ||
    trimmed === "undefined"
  );
}

function normalizeAbsoluteUrl(rawUrl: string, apiOrigin: string): string {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      return `${apiOrigin}${parsed.pathname}${parsed.search}`;
    }
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

function buildStorageUrl(pathValue: string, apiOrigin: string): string {
  const cleanPath = pathValue.replace(/^\/+/, "");
  if (cleanPath.startsWith("storage/")) {
    return `${apiOrigin}/${cleanPath}`;
  }
  return `${apiOrigin}/storage/${cleanPath}`;
}

export function resolveMediaUrl(
  url?: string | null,
  fallbackPath?: string | null
): string | null {
  const apiOrigin = getApiOrigin();

  if (!isInvalidValue(url) && url) {
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return normalizeAbsoluteUrl(trimmed, apiOrigin);
    }
    return buildStorageUrl(trimmed, apiOrigin);
  }

  if (!isInvalidValue(fallbackPath) && fallbackPath) {
    return buildStorageUrl(fallbackPath.trim(), apiOrigin);
  }

  return null;
}

export function resolveGalleryUrls(
  galleryUrls?: string[] | null,
  galleryPaths?: string[] | null
): string[] {
  const rawList =
    galleryUrls && galleryUrls.length > 0 ? galleryUrls : (galleryPaths ?? []);

  const resolved: string[] = [];
  for (const item of rawList) {
    const validUrl = resolveMediaUrl(item);
    if (validUrl && !resolved.includes(validUrl)) {
      resolved.push(validUrl);
    }
  }

  return resolved;
}
