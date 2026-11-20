import { httpClient } from "@/lib/http-client";
import type { Testimonial } from "@/types/api.types";

export async function createTestimonial(
  data: FormData | Record<string, unknown>,
  token: string
): Promise<Testimonial> {
  return httpClient.post<Testimonial>("/admin/testimonials", data, {
    token,
  });
}

export async function updateTestimonial(
  id: number,
  data: FormData | Record<string, unknown>,
  token: string
): Promise<Testimonial> {
  return httpClient.put<Testimonial>(`/admin/testimonials/${id}`, data, {
    token,
  });
}

export async function deleteTestimonial(
  id: number,
  token: string
): Promise<{ success: boolean }> {
  return httpClient.delete<{ success: boolean }>(
    `/admin/testimonials/${id}`,
    { token }
  );
}
