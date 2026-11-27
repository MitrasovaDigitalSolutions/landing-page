import sharp from "sharp";
import { env } from "@/config/env";
import { resolveSiteConfig } from "@/config/sites";
import { getLiveSiteSettings } from "@/services/api/settings.service";
import type { SiteSettings } from "@/types/site-settings.types";

export const ALLOWED_ICON_SIZES = [32, 48, 96, 144, 180, 192] as const;

export const ICON_CACHE_CONTROL =
  "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

const DEFAULT_API_ORIGIN = "http://43.157.197.42:8088";
const UPSTREAM_TIMEOUT_MS = 10_000;
const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function getBackendOrigin(): string {
  try {
    return new URL(env.NEXT_PUBLIC_API_URL).origin;
  } catch {
    return DEFAULT_API_ORIGIN;
  }
}

export function normalizeIconSize(
  raw?: string | null,
  fallback = 96
): number {
  const parsed = raw ? Number.parseInt(raw, 10) : fallback;
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return (
    ALLOWED_ICON_SIZES.find((candidate) => parsed <= candidate) ??
    ALLOWED_ICON_SIZES[ALLOWED_ICON_SIZES.length - 1]
  );
}

function resolveUpstreamImageUrl(
  raw: string | null | undefined,
  backendOrigin: string
): string | null {
  const trimmed = raw?.trim() ?? "";
  if (
    !trimmed ||
    trimmed.toLowerCase() === "null" ||
    trimmed.toLowerCase() === "undefined"
  ) {
    return null;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const parsed = new URL(trimmed);
      if (
        parsed.hostname === "localhost" ||
        parsed.hostname === "127.0.0.1"
      ) {
        return `${backendOrigin}${parsed.pathname}${parsed.search}`;
      }
      return parsed.toString();
    } catch {
      return null;
    }
  }

  const clean = trimmed.replace(/^\/+/, "");
  const storagePath = clean.startsWith("storage/") ? clean : `storage/${clean}`;
  return `${backendOrigin}/${storagePath}`;
}

function pickTenantIconSource(settings: SiteSettings): string | null {
  const backendOrigin = getBackendOrigin();
  const candidates = [
    settings.general?.favicon_url,
    settings.general?.favicon_path,
    settings.general?.logo_url,
    settings.general?.logo_path,
  ];
  for (const candidate of candidates) {
    const resolved = resolveUpstreamImageUrl(candidate, backendOrigin);
    if (resolved) {
      return resolved;
    }
  }
  return null;
}

async function renderSquarePngFromBuffer(
  inputBuffer: Buffer,
  size: number
): Promise<Buffer> {
  const background =
    size === 180
      ? { r: 255, g: 255, b: 255, alpha: 1 }
      : { r: 0, g: 0, b: 0, alpha: 0 };

  const innerSize = Math.max(16, Math.round(size * 0.88));
  const padStart = Math.floor((size - innerSize) / 2);
  const padEnd = size - innerSize - padStart;

  return sharp(inputBuffer)
    .rotate()
    .resize(innerSize, innerSize, { fit: "contain", background })
    .extend({
      top: padStart,
      left: padStart,
      bottom: padEnd,
      right: padEnd,
      background,
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function buildFallbackMonogramPng(
  siteTitle: string,
  brandColor: string,
  size: number
): Promise<Buffer> {
  const safeColor = HEX_COLOR_RE.test(brandColor) ? brandColor : "#1E3A8A";
  const initialMatch = /[A-Za-z0-9]/.exec(siteTitle);
  const initial = (initialMatch?.[0] ?? "M").toUpperCase();
  const radius = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.56);

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    `<rect width="${size}" height="${size}" rx="${radius}" fill="${safeColor}"/>`,
    `<text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="${fontSize}">${initial}</text>`,
    `</svg>`,
  ].join("");

  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

export function wrapPngAsIco(pngBuffer: Buffer, size: number): Buffer {
  const header = Buffer.alloc(22);
  const dim = size >= 256 ? 0 : size;

  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(dim, 6);
  header.writeUInt8(dim, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(pngBuffer.length, 14);
  header.writeUInt32LE(22, 18);

  return Buffer.concat([header, pngBuffer]);
}

export async function buildSiteIconPng(size: number): Promise<Buffer> {
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);
  const settings = await getLiveSiteSettings(siteKey);
  const siteTitle = settings.general?.site_title?.trim() ?? config.name;
  const brandColor =
    settings.general?.brand_color?.trim() ?? config.defaultBrandColor;

  const sourceUrl = pickTenantIconSource(settings);
  if (sourceUrl) {
    try {
      const res = await fetch(sourceUrl, {
        cache: "no-store",
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      });
      if (res.ok) {
        const inputBuffer = Buffer.from(await res.arrayBuffer());
        return await renderSquarePngFromBuffer(inputBuffer, size);
      }
    } catch {
      // Fallback ke monogram SVG jika aset upstream gagal diunduh/dikonversi.
    }
  }

  return buildFallbackMonogramPng(siteTitle, brandColor, size);
}

export async function buildSiteFaviconIco(): Promise<Buffer> {
  const pngBuffer = await buildSiteIconPng(48);
  return wrapPngAsIco(pngBuffer, 48);
}
