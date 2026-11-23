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
