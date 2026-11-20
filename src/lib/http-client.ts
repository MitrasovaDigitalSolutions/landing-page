import { env } from "@/config/env";
import { ApiError } from "@/lib/api-error";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
} from "@/types/api.types";
import type { ZodType } from "zod";

export interface HttpRequestOptions extends Omit<RequestInit, "body"> {
  siteKey?: string;
  token?: string;
  params?: Record<string, string | number | boolean | undefined>;
  schema?: ZodType;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

interface RequestConfig extends HttpRequestOptions {
  body?: unknown;
}

interface LaravelPaginatorPayload<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

const DEFAULT_META: PaginationMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
};

function isLaravelPaginator<T>(
  value: unknown
): value is LaravelPaginatorPayload<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "current_page" in value &&
    "data" in value &&
    Array.isArray((value as { data: unknown }).data)
  );
}

function unwrapDataPayload(payload: unknown): unknown {
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    const inner = (payload as ApiResponse<unknown>).data;
    if (isLaravelPaginator<unknown>(inner)) {
      return inner.data;
    }
    return inner;
  }
  return payload;
}

function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const base = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${base}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

function buildHeaders(
  options?: HttpRequestOptions,
  isFormData = false
): Headers {
  const headers = new Headers(options?.headers);
  headers.set("Accept", "application/json");
  const siteKey = options?.siteKey ?? env.NEXT_PUBLIC_SITE_KEY;
  if (siteKey) {
    headers.set("X-Site-Key", siteKey);
  }
  if (options?.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return headers;
}

function serializeBody(body: unknown): BodyInit | undefined {
  if (body === undefined) return undefined;
  if (typeof FormData !== "undefined" && body instanceof FormData) return body;
  return JSON.stringify(body);
}

async function parseResponsePayload(response: Response): Promise<unknown> {
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const payload: unknown = isJson
    ? await response.json()
    : await response.text();
  if (!response.ok) {
    throw ApiError.fromPayload(response.status, payload);
  }
  return payload;
}

async function request<T>(
  method: string,
  endpoint: string,
  config?: RequestConfig
): Promise<T> {
  const { body, ...restOptions } = config ?? {};
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const headers = buildHeaders(restOptions, isFormData);

  let effectiveMethod = method;
  if ((method === "PUT" || method === "PATCH") && isFormData) {
    effectiveMethod = "POST";
    headers.set("X-HTTP-Method-Override", method);
    if (!body.has("_method")) body.append("_method", method);
  }

  const response = await fetch(buildUrl(endpoint, restOptions.params), {
    ...restOptions,
    method: effectiveMethod,
    headers,
    body: serializeBody(body),
  });
  const payload = await parseResponsePayload(response);
  const rawData = unwrapDataPayload(payload);

  return restOptions.schema
    ? (restOptions.schema.parse(rawData) as T)
    : (rawData as T);
}

export const httpClient = {
  get<T>(endpoint: string, options?: HttpRequestOptions): Promise<T> {
    return request<T>("GET", endpoint, options);
  },
  async getPaginated<T>(
    endpoint: string,
    options?: HttpRequestOptions
  ): Promise<PaginatedResult<T>> {
    const response = await fetch(buildUrl(endpoint, options?.params), {
      ...options,
      method: "GET",
      headers: buildHeaders(options, false),
    });
    const payload = await parseResponsePayload(response);
    if (typeof payload === "object" && payload !== null && "data" in payload) {
      const inner = (payload as { data: unknown; meta?: PaginationMeta }).data;
      if (isLaravelPaginator<T>(inner)) {
        return {
          data: inner.data,
          meta: {
            current_page: inner.current_page,
            last_page: inner.last_page,
            per_page: inner.per_page,
            total: inner.total,
          },
        };
      }
      const paginated = payload as Partial<PaginatedResponse<T>>;
      const data = Array.isArray(paginated.data) ? paginated.data : [];
      return {
        data,
        meta: paginated.meta ?? { ...DEFAULT_META, total: data.length },
      };
    }
    return { data: [], meta: DEFAULT_META };
  },
  post<T>(
    endpoint: string,
    body?: unknown,
    options?: HttpRequestOptions
  ): Promise<T> {
    return request<T>("POST", endpoint, { ...options, body });
  },
  put<T>(
    endpoint: string,
    body?: unknown,
    options?: HttpRequestOptions
  ): Promise<T> {
    return request<T>("PUT", endpoint, { ...options, body });
  },
  patch<T>(
    endpoint: string,
    body?: unknown,
    options?: HttpRequestOptions
  ): Promise<T> {
    return request<T>("PATCH", endpoint, { ...options, body });
  },
  delete<T>(endpoint: string, options?: HttpRequestOptions): Promise<T> {
    return request<T>("DELETE", endpoint, options);
  },
};
