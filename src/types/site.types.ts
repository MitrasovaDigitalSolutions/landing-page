export type TenantSlug =
  | "ksp"
  | "konveksi"
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
}

export interface SiteConfig {
  slug: TenantSlug;
  apiKey: string;
  name: string;
  shortName: string;
  defaultBrandColor: string;
  modules: SiteModuleFlags;
}
