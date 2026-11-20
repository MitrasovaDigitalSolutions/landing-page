"use server";

import { ApiError } from "@/lib/api-error";
import { httpClient } from "@/lib/http-client";
import type { InquiryResponse } from "@/types/api.types";

export interface InquiryActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export async function submitInquiryAction(
  formData: FormData
): Promise<InquiryActionResult> {
  try {
    const response = await httpClient.post<InquiryResponse>(
      "/inquiries",
      formData
    );

    return {
      success: true,
      message: response.message || "Pesan Anda berhasil dikirim!",
    };
  } catch (error: unknown) {
    if (ApiError.isApiError(error)) {
      return {
        success: false,
        message: error.message,
        fieldErrors: error.fieldErrors,
      };
    }

    return {
      success: false,
      message: "Terjadi kesalahan sistem saat mengirim pesan. Coba lagi nanti.",
    };
  }
}

export async function replyInquiry(
  id: number,
  reply: string,
  token: string
): Promise<{ success: boolean; message: string }> {
  return httpClient.post<{ success: boolean; message: string }>(
    `/admin/inquiries/${id}/reply`,
    { reply },
    { token }
  );
}

export async function deleteInquiry(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  return httpClient.delete<{ success: boolean }>(`/admin/inquiries/${id}`, {
    token,
  });
}
