import { CACHE_TAGS } from "@/lib/cache-tags";
import { httpClient } from "@/lib/http-client";
import type { Faq, FaqCategory, FaqRawItem } from "@/types/api.types";
import { cacheLife, cacheTag } from "next/cache";

export async function getFaqs(siteKey?: string): Promise<FaqRawItem[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.faqs(siteKey));

  return httpClient.get<FaqRawItem[]>("/faqs", { siteKey });
}

export async function getAdminFaqCategories(
  token: string
): Promise<FaqCategory[]> {
  return httpClient.get<FaqCategory[]>("/admin/faq-categories", { token });
}

export async function getAdminFaqs(token: string): Promise<Faq[]> {
  return httpClient.get<Faq[]>("/admin/faqs", { token });
}
