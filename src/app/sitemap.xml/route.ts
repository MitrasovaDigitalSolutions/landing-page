import type { NextRequest } from "next/server";
import { env } from "@/config/env";
import { buildLiveSitemapXml } from "@/lib/sitemap-xml";

const NO_STORE_CACHE = "no-store, no-cache, must-revalidate, max-age=0";

export async function GET(request: NextRequest): Promise<Response> {
  const _path = request.nextUrl.pathname;
  const xml = await buildLiveSitemapXml(env.NEXT_PUBLIC_SITE_KEY);

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": NO_STORE_CACHE,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function HEAD(request: NextRequest): Promise<Response> {
  const _path = request.nextUrl.pathname;
  const xml = await buildLiveSitemapXml(env.NEXT_PUBLIC_SITE_KEY);

  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Content-Length": String(Buffer.byteLength(xml, "utf8")),
      "Cache-Control": NO_STORE_CACHE,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
