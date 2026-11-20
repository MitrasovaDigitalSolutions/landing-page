"use server";

import { getAdminSession } from "@/lib/auth";
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
} from "@/features/testimonials/services/testimonials.mutations";
import { ApiError } from "@/lib/api-error";
import { CACHE_TAGS, invalidateTags } from "@/lib/cache-tags";

export interface TestimonialActionResult {
  success: boolean;
  message: string;
}

export async function saveTestimonialAction(
  id: number | null,
  formData: FormData
): Promise<TestimonialActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    if (id) {
      await updateTestimonial(id, formData, session.accessToken);
    } else {
      await createTestimonial(formData, session.accessToken);
    }
    invalidateTags([CACHE_TAGS.testimonials()], ["/", "/admin/showcase"]);
    return { success: true, message: "Testimoni berhasil disimpan!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menyimpan testimoni.",
    };
  }
}

export async function deleteTestimonialAction(
  id: number
): Promise<TestimonialActionResult> {
  const session = await getAdminSession();
  if (!session?.accessToken) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    await deleteTestimonial(id, session.accessToken);
    invalidateTags([CACHE_TAGS.testimonials()], ["/", "/admin/showcase"]);
    return { success: true, message: "Testimoni berhasil dihapus!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: ApiError.isApiError(error)
        ? error.message
        : "Gagal menghapus testimoni.",
    };
  }
}
