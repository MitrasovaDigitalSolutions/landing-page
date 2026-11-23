import { CACHE_TAGS } from "@/lib/cache-tags";
import { httpClient } from "@/lib/http-client";
import type { Testimonial } from "@/types/api.types";
import { cacheLife, cacheTag } from "next/cache";

export async function getTestimonials(
  siteKey?: string
): Promise<Testimonial[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.testimonials(siteKey));

  return httpClient.get<Testimonial[]>("/testimonials", { siteKey });
}
