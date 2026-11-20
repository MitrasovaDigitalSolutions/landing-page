export interface AuthUserSite {
  id: string;
  name: string;
  slug: string;
  role: "admin" | "editor";
}

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  is_superadmin?: boolean;
  sites?: AuthUserSite[];
  accessToken?: string;
}

export interface LoginResponseData {
  token: string;
  user: {
    id: number | string;
    name: string;
    email: string;
    is_superadmin?: boolean;
    sites?: AuthUserSite[];
  };
}

export interface AdminSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isSuperadmin?: boolean;
    sites?: AuthUserSite[];
  };
  accessToken?: string;
  expires: string;
}
