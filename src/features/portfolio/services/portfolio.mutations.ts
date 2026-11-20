import { httpClient } from "@/lib/http-client";
import type { Portfolio } from "@/types/api.types";

export async function createPortfolio(
  data: FormData | Record<string, unknown>,
  token: string
): Promise<Portfolio> {
  return httpClient.post<Portfolio>("/admin/portfolios", data, { token });
}

export async function updatePortfolio(
  id: number,
  data: FormData | Record<string, unknown>,
  token: string
): Promise<Portfolio> {
  return httpClient.put<Portfolio>(`/admin/portfolios/${id}`, data, { token });
}

export async function deletePortfolio(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  return httpClient.delete<{ success: boolean }>(`/admin/portfolios/${id}`, {
    token,
  });
}
