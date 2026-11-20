import { httpClient } from "@/lib/http-client";
import type { Partner } from "@/types/api.types";

export async function createPartner(
  data: FormData | Record<string, unknown>,
  token: string
): Promise<Partner> {
  return httpClient.post<Partner>("/admin/partners", data, { token });
}

export async function updatePartner(
  id: number,
  data: FormData | Record<string, unknown>,
  token: string
): Promise<Partner> {
  return httpClient.put<Partner>(`/admin/partners/${id}`, data, { token });
}

export async function deletePartner(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  return httpClient.delete<{ success: boolean }>(`/admin/partners/${id}`, {
    token,
  });
}
