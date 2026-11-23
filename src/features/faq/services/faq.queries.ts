import { CACHE_TAGS } from "@/lib/cache-tags";
import { httpClient } from "@/lib/http-client";
import type { FaqRawItem } from "@/types/api.types";
import { cacheLife, cacheTag } from "next/cache";

export async function getFaqs(siteKey?: string): Promise<FaqRawItem[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.faqs(siteKey));

  try {
    return await httpClient.get<FaqRawItem[]>("/faqs", { siteKey });
  } catch {
    return [];
  }
}
