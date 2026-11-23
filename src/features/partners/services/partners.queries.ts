import { CACHE_TAGS } from "@/lib/cache-tags";
import { httpClient } from "@/lib/http-client";
import type { Partner } from "@/types/api.types";
import { cacheLife, cacheTag } from "next/cache";

export async function getPartners(siteKey?: string): Promise<Partner[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.partners(siteKey));

  try {
    return await httpClient.get<Partner[]>("/partners", { siteKey });
  } catch {
    return [];
  }
}
