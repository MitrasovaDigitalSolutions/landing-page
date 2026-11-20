import { env } from "@/config/env";
import type { NextRequest } from "next/server";

interface MediaRouteContext {
  params: Promise<{ path: string[] }>;
}

const DEFAULT_API_ORIGIN = "http://43.157.197.42:8088";
const UPSTREAM_TIMEOUT_MS = 15_000;
const CACHE_CONTROL_HEADER =
  "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

const CONDITIONAL_REQUEST_HEADERS = [
  "if-none-match",
  "if-modified-since",
] as const;

const REVALIDATED_RESPONSE_HEADERS = ["etag", "last-modified"] as const;

const PASSTHROUGH_HEADERS = [
  "content-length",
  "etag",
  "last-modified",
  "accept-ranges",
] as const;

function getBackendOrigin(): string {
  try {
    return new URL(env.NEXT_PUBLIC_API_URL).origin;
  } catch {
    return DEFAULT_API_ORIGIN;
  }
}

function isValidPathSegments(segments: string[] | undefined): segments is string[] {
  if (!Array.isArray(segments) || segments.length === 0) {
    return false;
  }
  return segments.every(
    (segment) =>
      segment.length > 0 &&
      segment !== "." &&
      segment !== ".." &&
      !segment.includes("/") &&
      !segment.includes("\\") &&
      !segment.includes("\0")
  );
}

function buildTargetUrl(
  segments: string[],
  search: string,
  apiOrigin: string
): URL | null {
  const encodedPath = segments.map((segment) => encodeURIComponent(segment)).join("/");
  try {
    const targetUrl = new URL(`/storage/${encodedPath}`, apiOrigin);
    if (search) {
      targetUrl.search = search;
    }
    if (
      targetUrl.origin !== apiOrigin ||
      !targetUrl.pathname.startsWith("/storage/")
    ) {
      return null;
    }
    return targetUrl;
  } catch {
    return null;
  }
}

async function proxyMedia(
  request: NextRequest,
  context: MediaRouteContext,
  method: "GET" | "HEAD"
): Promise<Response> {
  const { path } = await context.params;
  if (!isValidPathSegments(path)) {
    return new Response("Invalid media path", { status: 400 });
  }

  const apiOrigin = getBackendOrigin();
  const targetUrl = buildTargetUrl(path, request.nextUrl.search, apiOrigin);
  if (!targetUrl) {
    return new Response("Invalid media target", { status: 400 });
  }

  const requestHeaders = new Headers({
    Accept: request.headers.get("accept") ?? "*/*",
  });
  for (const headerName of CONDITIONAL_REQUEST_HEADERS) {
    const value = request.headers.get(headerName);
    if (value) {
      requestHeaders.set(headerName, value);
    }
  }

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl.toString(), {
      method,
      headers: requestHeaders,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch {
    return new Response("Media upstream unavailable", { status: 502 });
  }

  if (upstream.status === 304) {
    const headers304 = new Headers();
    for (const headerName of REVALIDATED_RESPONSE_HEADERS) {
      const value = upstream.headers.get(headerName);
      if (value) {
        headers304.set(headerName, value);
      }
    }
    headers304.set("Cache-Control", CACHE_CONTROL_HEADER);
    return new Response(null, { status: 304, headers: headers304 });
  }

  if (!upstream.ok) {
    return new Response(null, { status: upstream.status });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    upstream.headers.get("content-type") ?? "application/octet-stream"
  );
  for (const headerName of PASSTHROUGH_HEADERS) {
    const value = upstream.headers.get(headerName);
    if (value) {
      headers.set(headerName, value);
    }
  }
  headers.set("Cache-Control", CACHE_CONTROL_HEADER);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Content-Security-Policy", "default-src 'none'; sandbox");

  return new Response(method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    headers,
  });
}

export async function GET(
  request: NextRequest,
  context: MediaRouteContext
): Promise<Response> {
  return proxyMedia(request, context, "GET");
}

export async function HEAD(
  request: NextRequest,
  context: MediaRouteContext
): Promise<Response> {
  return proxyMedia(request, context, "HEAD");
}
