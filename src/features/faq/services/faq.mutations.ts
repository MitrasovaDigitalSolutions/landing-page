import { httpClient } from "@/lib/http-client";
import type { Faq, FaqCategory } from "@/types/api.types";

export async function createFaqCategory(
  data: Record<string, unknown>,
  token: string
): Promise<FaqCategory> {
  return httpClient.post<FaqCategory>("/admin/faq-categories", data, {
    token,
  });
}

export async function updateFaqCategory(
  id: number,
  data: Record<string, unknown>,
  token: string
): Promise<FaqCategory> {
  return httpClient.put<FaqCategory>(`/admin/faq-categories/${id}`, data, {
    token,
  });
}

export async function deleteFaqCategory(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  return httpClient.delete<{ success: boolean }>(
    `/admin/faq-categories/${id}`,
    { token }
  );
}

export async function createFaq(
  data: Record<string, unknown>,
  token: string
): Promise<Faq> {
  return httpClient.post<Faq>("/admin/faqs", data, { token });
}

export async function updateFaq(
  id: number,
  data: Record<string, unknown>,
  token: string
): Promise<Faq> {
  return httpClient.put<Faq>(`/admin/faqs/${id}`, data, { token });
}

export async function deleteFaq(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  return httpClient.delete<{ success: boolean }>(`/admin/faqs/${id}`, {
    token,
  });
}
