import type { NextRequest } from "next/server";
import { buildSiteFaviconIco, ICON_CACHE_CONTROL } from "@/lib/site-icon";

export async function GET(request: NextRequest): Promise<Response> {
  const _path = request.nextUrl.pathname;
  const icoBuffer = await buildSiteFaviconIco();

  return new Response(new Uint8Array(icoBuffer), {
    status: 200,
    headers: {
      "Content-Type": "image/x-icon",
      "Content-Length": String(icoBuffer.byteLength),
      "Cache-Control": ICON_CACHE_CONTROL,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function HEAD(request: NextRequest): Promise<Response> {
  const _path = request.nextUrl.pathname;
  const icoBuffer = await buildSiteFaviconIco();

  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "image/x-icon",
      "Content-Length": String(icoBuffer.byteLength),
      "Cache-Control": ICON_CACHE_CONTROL,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
