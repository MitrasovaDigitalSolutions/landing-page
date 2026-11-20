import { httpClient } from "@/lib/http-client";
import type { BusinessUnit } from "@/types/api.types";

export async function createBusinessUnit(
  data: FormData,
  token: string
): Promise<BusinessUnit> {
  return httpClient.post<BusinessUnit>("/admin/business-units", data, {
    token,
  });
}

export async function updateBusinessUnit(
  id: number,
  data: FormData,
  token: string
): Promise<BusinessUnit> {
  return httpClient.put<BusinessUnit>(`/admin/business-units/${id}`, data, {
    token,
  });
}

export async function deleteBusinessUnit(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  return httpClient.delete<{ success: boolean }>(
    `/admin/business-units/${id}`,
    { token }
  );
}
