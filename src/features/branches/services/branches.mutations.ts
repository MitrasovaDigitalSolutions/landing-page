import { httpClient } from "@/lib/http-client";
import type { Branch } from "@/types/api.types";

export async function createBranch(
  data: FormData,
  token: string
): Promise<Branch> {
  return httpClient.post<Branch>("/admin/branches", data, { token });
}

export async function updateBranch(
  id: number,
  data: FormData,
  token: string
): Promise<Branch> {
  return httpClient.put<Branch>(`/admin/branches/${id}`, data, { token });
}

export async function deleteBranch(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  return httpClient.delete<{ success: boolean }>(`/admin/branches/${id}`, {
    token,
  });
}
