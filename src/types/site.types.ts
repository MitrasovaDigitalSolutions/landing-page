export type TenantSlug =
  | "ksp"
  | "konveksi"
  | "miset"
  | "teknologi"
  | "percetakan"
  | "transportasi"
  | "bengkel-las";

export interface SiteModuleFlags {
  quoteUpload: boolean;
  portfolios: boolean;
  services: boolean;
  articles: boolean;
  testimonials: boolean;
  partners: boolean;
  faqs: boolean;
  bookingRoute: boolean;
  branches?: boolean;
  businessUnits?: boolean;
  careers?: boolean;
  contact?: boolean;
}

export interface EffectiveModuleFlags extends SiteModuleFlags {
  branches: boolean;
  businessUnits: boolean;
  careers: boolean;
  contact: boolean;
}

export interface SiteConfig {
  slug: TenantSlug;
  apiKey: string;
  name: string;
  shortName: string;
  defaultBrandColor: string;
  modules: SiteModuleFlags;
}
