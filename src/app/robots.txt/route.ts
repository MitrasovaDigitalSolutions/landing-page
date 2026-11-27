import type { NextRequest } from "next/server";
import { env } from "@/config/env";
import { isIndexingEnabled, resolveSiteUrl } from "@/lib/seo";
import { getLiveSiteSettings } from "@/services/api/settings.service";

const NO_STORE_CACHE = "no-store, no-cache, must-revalidate, max-age=0";

async function buildRobotsText(): Promise<string> {
  const settings = await getLiveSiteSettings(env.NEXT_PUBLIC_SITE_KEY);
  const siteUrl = resolveSiteUrl(settings);

  if (!isIndexingEnabled(settings)) {
    return ["User-agent: *", "Disallow: /", `Host: ${siteUrl}`, ""].join("\n");
  }

  return [
    "User-agent: *",
    "Allow: /",
    "Allow: /api/media/",
    "Disallow: /api/",
    `Host: ${siteUrl}`,
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
}

export async function GET(request: NextRequest): Promise<Response> {
  const _path = request.nextUrl.pathname;
  const body = await buildRobotsText();

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": NO_STORE_CACHE,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function HEAD(request: NextRequest): Promise<Response> {
  const _path = request.nextUrl.pathname;
  const body = await buildRobotsText();

  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Length": String(Buffer.byteLength(body, "utf8")),
      "Cache-Control": NO_STORE_CACHE,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
