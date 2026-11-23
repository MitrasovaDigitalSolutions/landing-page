import type { SiteModulesActiveFlags } from "@/types/site-settings.types";
import type {
  EffectiveModuleFlags,
  SiteConfig,
  SiteModuleFlags,
  TenantSlug,
} from "@/types/site.types";

export const SITES_REGISTRY: Record<TenantSlug, SiteConfig> = {
  ksp: {
    slug: "ksp",
    apiKey: "key-ksp-12345",
    name: "KSP Mitra Sejati Persada",
    shortName: "KSP Mitra Sejati",
    defaultBrandColor: "#1E3A8A",
    modules: {
      quoteUpload: false,
      portfolios: true,
      services: true,
      articles: true,
      testimonials: true,
      partners: true,
      faqs: true,
      bookingRoute: false,
    },
  },
  konveksi: {
    slug: "konveksi",
    apiKey: "key-konveksi-12345",
    name: "Mitrasova Konveksi & Garment",
    shortName: "Mitrasova Konveksi",
    defaultBrandColor: "#DC2626",
    modules: {
      quoteUpload: true,
      portfolios: true,
      services: true,
      articles: true,
      testimonials: true,
      partners: true,
      faqs: true,
      bookingRoute: false,
    },
  },
  teknologi: {
    slug: "teknologi",
    apiKey: "key-teknologi-12345",
    name: "Mitrasova Digital Solutions",
    shortName: "Mitrasova Digital",
    defaultBrandColor: "#2563EB",
    modules: {
      quoteUpload: true,
      portfolios: true,
      services: true,
      articles: true,
      testimonials: true,
      partners: true,
      faqs: true,
      bookingRoute: false,
    },
  },
  percetakan: {
    slug: "percetakan",
    apiKey: "key-percetakan-12345",
    name: "Mitrasova Printing & Packaging",
    shortName: "Mitrasova Printing",
    defaultBrandColor: "#D97706",
    modules: {
      quoteUpload: true,
      portfolios: true,
      services: true,
      articles: true,
      testimonials: true,
      partners: true,
      faqs: true,
      bookingRoute: false,
    },
  },
  transportasi: {
    slug: "transportasi",
    apiKey: "key-trans-12345",
    name: "Mitrasova Trans & Logistics",
    shortName: "Mitrasova Trans",
    defaultBrandColor: "#059669",
    modules: {
      quoteUpload: false,
      portfolios: false,
      services: true,
      articles: true,
      testimonials: true,
      partners: true,
      faqs: true,
      bookingRoute: true,
    },
  },
  "bengkel-las": {
    slug: "bengkel-las",
    apiKey: "key-las-12345",
    name: "Mitrasova Las & Interior",
    shortName: "Mitrasova Interior",
    defaultBrandColor: "#4B5563",
    modules: {
      quoteUpload: true,
      portfolios: true,
      services: true,
      articles: true,
      testimonials: true,
      partners: true,
      faqs: true,
      bookingRoute: false,
    },
  },
};

export const DEFAULT_SITE_SLUG: TenantSlug = "ksp";

function isTenantSlug(value: string): value is TenantSlug {
  return Object.hasOwn(SITES_REGISTRY, value);
}

export function resolveSiteConfig(keyOrSlug: string): SiteConfig {
  if (isTenantSlug(keyOrSlug)) {
    return SITES_REGISTRY[keyOrSlug];
  }

  const foundByKey = Object.values(SITES_REGISTRY).find(
    (config) => config.apiKey === keyOrSlug
  );
  if (foundByKey) {
    return foundByKey;
  }

  return SITES_REGISTRY[DEFAULT_SITE_SLUG];
}

export function resolveEffectiveModules(
  base: SiteModuleFlags,
  backendFlags?: SiteModulesActiveFlags
): EffectiveModuleFlags {
  return {
    ...base,
    services: backendFlags?.services ?? base.services,
    portfolios: backendFlags?.portfolios ?? base.portfolios,
    articles: backendFlags?.news ?? base.articles,
    branches: backendFlags?.branches ?? base.branches ?? true,
    businessUnits: backendFlags?.business_units ?? base.businessUnits ?? true,
    careers: backendFlags?.careers ?? base.careers ?? true,
    contact: backendFlags?.contact ?? base.contact ?? true,
  };
}
