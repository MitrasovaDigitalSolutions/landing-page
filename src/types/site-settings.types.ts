export interface SiteGeneralSettings {
  site_title?: string;
  tagline?: string;
  brand_color?: string;
  meta_keywords?: string;
  logo_path?: string;
  logo_url?: string;
}

export interface SiteContactSettings {
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  maps_embed?: string;
  maps_embed_url?: string;
}

export interface SiteSocialSettings {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
}

export interface SiteLegalSettings {
  badan_hukum?: string;
  copyright?: string;
}

export interface SiteModulesActiveFlags {
  services?: boolean;
  portfolios?: boolean;
  branches?: boolean;
  business_units?: boolean;
  careers?: boolean;
  news?: boolean;
  contact?: boolean;
}

export interface SiteModulesSettings {
  is_active?: SiteModulesActiveFlags;
}

export interface SiteSettings {
  general?: SiteGeneralSettings;
  contact?: SiteContactSettings;
  social?: SiteSocialSettings;
  legal?: SiteLegalSettings;
  modules?: SiteModulesSettings;
  [group: string]: unknown;
}
