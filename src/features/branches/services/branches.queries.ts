import { CACHE_TAGS } from "@/lib/cache-tags";
import { httpClient } from "@/lib/http-client";
import type { Branch } from "@/types/api.types";
import { cacheLife, cacheTag } from "next/cache";

export async function getBranches(siteKey?: string): Promise<Branch[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CACHE_TAGS.branches(siteKey));

  return httpClient.get<Branch[]>("/branches", { siteKey });
}

export async function getAdminBranches(token: string): Promise<Branch[]> {
  return httpClient.get<Branch[]>("/admin/branches", { token });
}
