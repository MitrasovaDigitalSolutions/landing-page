import { CACHE_TAGS } from "@/lib/cache-tags";
import { httpClient } from "@/lib/http-client";
import type { BusinessUnit } from "@/types/api.types";
import { cacheLife, cacheTag } from "next/cache";

export async function getBusinessUnits(
  siteKey?: string
): Promise<BusinessUnit[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.businessUnits(siteKey));

  try {
    return await httpClient.get<BusinessUnit[]>("/business-units", { siteKey });
  } catch {
    return [];
  }
}
