import { CACHE_TAGS } from "@/lib/cache-tags";
import { httpClient } from "@/lib/http-client";
import type { Service, ServiceType } from "@/types/api.types";
import { cacheLife, cacheTag } from "next/cache";

export async function getServiceTypes(siteKey?: string): Promise<ServiceType[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.serviceTypes(siteKey));

  return httpClient.get<ServiceType[]>("/service-types", { siteKey });
}

export async function getServices(
  serviceTypeSlug?: string,
  siteKey?: string
): Promise<Service[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.services(siteKey));

  return httpClient.get<Service[]>("/services", {
    siteKey,
    params: serviceTypeSlug ? { service_type: serviceTypeSlug } : undefined,
  });
}

export async function getServiceBySlug(
  slug: string,
  siteKey?: string
): Promise<Service> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.service(slug, siteKey), CACHE_TAGS.services(siteKey));

  return httpClient.get<Service>(`/services/${slug}`, { siteKey });
}

export async function getAdminServiceTypes(
  token: string
): Promise<ServiceType[]> {
  return httpClient.get<ServiceType[]>("/admin/service-types", { token });
}

export async function getAdminServices(
  token: string,
  page = 1,
  serviceTypeId?: number
): Promise<Service[]> {
  return httpClient.get<Service[]>("/admin/services", {
    token,
    params: {
      page,
      service_type_id: serviceTypeId,
    },
  });
}

export async function getAdminServiceDetail(
  id: number,
  token: string
): Promise<Service> {
  return httpClient.get<Service>(`/admin/services/${id}`, { token });
}
