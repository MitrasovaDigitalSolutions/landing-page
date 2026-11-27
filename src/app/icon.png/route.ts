import type { NextRequest } from "next/server";
import {
  buildSiteIconPng,
  ICON_CACHE_CONTROL,
  normalizeIconSize,
} from "@/lib/site-icon";

export async function GET(request: NextRequest): Promise<Response> {
  const size = normalizeIconSize(request.nextUrl.searchParams.get("size"), 96);
  const pngBuffer = await buildSiteIconPng(size);

  return new Response(new Uint8Array(pngBuffer), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Length": String(pngBuffer.byteLength),
      "Cache-Control": ICON_CACHE_CONTROL,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function HEAD(request: NextRequest): Promise<Response> {
  const size = normalizeIconSize(request.nextUrl.searchParams.get("size"), 96);
  const pngBuffer = await buildSiteIconPng(size);

  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Length": String(pngBuffer.byteLength),
      "Cache-Control": ICON_CACHE_CONTROL,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
