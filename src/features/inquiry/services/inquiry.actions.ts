"use server";

import { getAdminSession } from "@/lib/auth";
import { deleteInquiry } from "@/features/inquiry/services/inquiry.mutations";
import { ApiError } from "@/lib/api-error";
import { httpClient } from "@/lib/http-client";
import { revalidatePath } from "next/cache";

export interface InquiryActionResult {
  success: boolean;
  message: string;
}

export async function updateInquiryStatusAction(
  id: number,
  status: string,
  notes?: string
): Promise<InquiryActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await httpClient.patch(
      `/admin/inquiries/${id}/status`,
      { status, notes },
      { token: session.accessToken }
    );
    revalidatePath("/admin/inquiries");
    revalidatePath("/admin");
    return { success: true, message: "Status & catatan pesan berhasil diperbarui!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal memperbarui status pesan.",
    };
  }
}

export async function deleteInquiryAction(
  id: number
): Promise<InquiryActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await deleteInquiry(id, session.accessToken);
    revalidatePath("/admin/inquiries");
    revalidatePath("/admin");
    return { success: true, message: "Pesan berhasil dihapus!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menghapus pesan.",
    };
  }
}
