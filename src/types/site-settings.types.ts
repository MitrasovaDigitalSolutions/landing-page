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

export interface SiteSettings {
  general?: SiteGeneralSettings;
  contact?: SiteContactSettings;
  social?: SiteSocialSettings;
  legal?: SiteLegalSettings;
  [group: string]: unknown;
}

export interface SettingUpsertItem {
  group: string;
  key: string;
  value: string | null;
}

export interface SettingsBulkRequestPayload {
  settings: SettingUpsertItem[];
}
