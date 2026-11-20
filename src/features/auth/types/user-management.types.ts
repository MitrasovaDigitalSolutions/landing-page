export interface ManagedSite {
  id: string;
  name: string;
  slug: string;
  api_key?: string;
  domain?: string | null;
  is_active: boolean;
  users_count?: number;
  services_count?: number;
  articles_count?: number;
}

export interface SiteFormData {
  name: string;
  slug?: string;
  domain?: string;
  is_active?: boolean;
}

export interface UserSitePivot {
  user_id: number;
  site_id: string;
  role: "admin" | "editor";
}

export interface UserAssignedSite {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  role?: "admin" | "editor";
  pivot?: UserSitePivot;
}

export interface ManagedUser {
  id: number;
  name: string;
  email: string;
  is_superadmin: boolean;
  created_at?: string;
  sites?: UserAssignedSite[];
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  is_superadmin?: boolean;
}
