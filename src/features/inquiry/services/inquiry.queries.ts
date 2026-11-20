import type { InquiryItem } from "@/features/inquiry/types/inquiry.types";
import { httpClient } from "@/lib/http-client";

export async function getAdminInquiries(
  token: string,
  page = 1,
  status?: string
): Promise<InquiryItem[]> {
  return httpClient.get<InquiryItem[]>("/admin/inquiries", {
    token,
    params: {
      page,
      status: status ?? undefined,
    },
  });
}

export async function getAdminInquiryDetail(
  id: number,
  token: string
): Promise<InquiryItem> {
  return httpClient.get<InquiryItem>(`/admin/inquiries/${id}`, { token });
}
