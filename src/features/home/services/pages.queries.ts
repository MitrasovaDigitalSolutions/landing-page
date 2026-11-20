import { httpClient } from "@/lib/http-client";
import type { PageDetail } from "@/types/api.types";

export async function getAdminPageDetail(
  id: number,
  token: string
): Promise<PageDetail> {
  return httpClient.get<PageDetail>(`/admin/pages/${id}`, { token });
}

export async function getAdminPages(token: string): Promise<PageDetail[]> {
  const pages = await httpClient.get<PageDetail[]>("/admin/pages", { token });
  if (!Array.isArray(pages)) {
    return [];
  }

  const allHaveCounts = pages.every(
    (page) =>
      typeof page.sections_count === "number" || Array.isArray(page.sections)
  );
  if (allHaveCounts) {
    return pages;
  }

  return Promise.all(
    pages.map(async (page) => {
      if (
        typeof page.sections_count === "number" ||
        Array.isArray(page.sections)
      ) {
        return page;
      }
      try {
        const detail = await getAdminPageDetail(page.id, token);
        const sections = Array.isArray(detail.sections) ? detail.sections : [];
        return {
          ...page,
          ...detail,
          sections,
          sections_count: detail.sections_count ?? sections.length,
        };
      } catch {
        return {
          ...page,
          sections: [],
        };
      }
    })
  );
}
