import { httpClient } from "@/lib/http-client";
import type { PageDetail, PageSection } from "@/types/api.types";

export async function createPage(
  data: Record<string, unknown>,
  token: string
): Promise<PageDetail> {
  return httpClient.post<PageDetail>("/admin/pages", data, { token });
}

export async function updatePage(
  id: number,
  data: Record<string, unknown>,
  token: string
): Promise<PageDetail> {
  return httpClient.put<PageDetail>(`/admin/pages/${id}`, data, { token });
}

export async function deletePage(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  return httpClient.delete<{ success: boolean }>(`/admin/pages/${id}`, {
    token,
  });
}

export async function addSection(
  pageId: number,
  data: FormData | Record<string, unknown>,
  token: string
): Promise<PageSection> {
  return httpClient.post<PageSection>(`/admin/pages/${pageId}/sections`, data, {
    token,
  });
}

export async function updateSection(
  id: number,
  data: FormData | Record<string, unknown>,
  token: string
): Promise<PageSection> {
  return httpClient.put<PageSection>(`/admin/sections/${id}`, data, {
    token,
  });
}

export async function deleteSection(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  return httpClient.delete<{ success: boolean }>(`/admin/sections/${id}`, {
    token,
  });
}
