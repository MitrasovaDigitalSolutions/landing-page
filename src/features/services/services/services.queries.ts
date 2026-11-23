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

export async function getServices(
  serviceTypeSlug?: string,
  siteKey?: string
): Promise<Service[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.services(siteKey));

  try {
    return await httpClient.get<Service[]>("/services", {
      siteKey,
      params: serviceTypeSlug ? { service_type: serviceTypeSlug } : undefined,
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
