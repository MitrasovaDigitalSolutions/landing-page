import { CACHE_TAGS } from "@/lib/cache-tags";
import { httpClient } from "@/lib/http-client";
import type { Service, ServiceType } from "@/types/api.types";
import { cacheLife, cacheTag } from "next/cache";

export async function getServiceTypes(siteKey?: string): Promise<ServiceType[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.serviceTypes(siteKey));

  try {
    return await httpClient.get<ServiceType[]>("/service-types", { siteKey });
  } catch {
    return [];
  }
}

export interface GetServicesOptions {
  serviceType?: string;
  featured?: boolean;
  perPage?: number;
}

export async function getServices(
  optionsOrType?: string | GetServicesOptions,
  siteKey?: string
): Promise<Service[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.services(siteKey));

  const options: GetServicesOptions =
    typeof optionsOrType === "string"
      ? { serviceType: optionsOrType }
      : (optionsOrType ?? {});

  const params: Record<string, string | number> = {};
  if (options.serviceType) {
    params.service_type = options.serviceType;
  }
  if (options.featured) {
    params.featured = 1;
  }
  if (options.perPage !== undefined) {
    params.per_page = options.perPage;
  }

  try {
    return await httpClient.get<Service[]>("/services", {
      siteKey,
      params: Object.keys(params).length > 0 ? params : undefined,
    });
  } catch {
    return [];
  }
}

export async function getServiceBySlug(
  slug: string,
  siteKey?: string
): Promise<Service | null> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.service(slug, siteKey), CACHE_TAGS.services(siteKey));

  try {
    return await httpClient.get<Service>(`/services/${slug}`, { siteKey });
  } catch {
    return null;
  }
}
