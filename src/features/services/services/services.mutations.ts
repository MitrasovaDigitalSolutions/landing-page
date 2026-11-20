import { httpClient } from "@/lib/http-client";
import type { Service, ServiceType } from "@/types/api.types";

export async function createServiceType(
  data: Record<string, unknown>,
  token: string
): Promise<ServiceType> {
  return httpClient.post<ServiceType>("/admin/service-types", data, { token });
}

export async function updateServiceType(
  id: number,
  data: Record<string, unknown>,
  token: string
): Promise<ServiceType> {
  return httpClient.put<ServiceType>(`/admin/service-types/${id}`, data, {
    token,
  });
}

export async function deleteServiceType(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  return httpClient.delete<{ success: boolean }>(
    `/admin/service-types/${id}`,
    { token }
  );
}

export async function createService(
  data: FormData | Record<string, unknown>,
  token: string
): Promise<Service> {
  return httpClient.post<Service>("/admin/services", data, { token });
}

export async function updateService(
  id: number,
  data: FormData | Record<string, unknown>,
  token: string
): Promise<Service> {
  return httpClient.put<Service>(`/admin/services/${id}`, data, { token });
}

export async function deleteService(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  return httpClient.delete<{ success: boolean }>(`/admin/services/${id}`, {
    token,
  });
}
