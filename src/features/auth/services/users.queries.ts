import type {
  ManagedSite,
  ManagedUser,
} from "@/features/auth/types/user-management.types";
import { httpClient } from "@/lib/http-client";

export async function getAdminUsers(token: string): Promise<ManagedUser[]> {
  return httpClient.get<ManagedUser[]>("/admin/users", { token });
}

export async function getAdminSites(token: string): Promise<ManagedSite[]> {
  return httpClient.get<ManagedSite[]>("/admin/sites", { token });
}
