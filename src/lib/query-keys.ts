export const queryKeys = {
  dashboard: {
    all: ["dashboard"] as const,
    summary: () => [...queryKeys.dashboard.all, "summary"] as const,
  },
  settings: {
    all: ["settings"] as const,
    detail: (siteKey?: string) =>
      [...queryKeys.settings.all, siteKey ?? "default"] as const,
  },
  pages: {
    all: ["pages"] as const,
    list: () => [...queryKeys.pages.all, "list"] as const,
    detail: (slugOrId: string | number) =>
      [...queryKeys.pages.all, "detail", slugOrId] as const,
  },
  serviceTypes: {
    all: ["service-types"] as const,
    list: () => [...queryKeys.serviceTypes.all, "list"] as const,
  },
  services: {
    all: ["services"] as const,
    list: (typeId?: string | number) =>
      [...queryKeys.services.all, "list", typeId ?? "all"] as const,
  },
  portfolios: {
    all: ["portfolios"] as const,
    list: (typeId?: string | number) =>
      [...queryKeys.portfolios.all, "list", typeId ?? "all"] as const,
  },
  articleCategories: {
    all: ["article-categories"] as const,
    list: () => [...queryKeys.articleCategories.all, "list"] as const,
  },
  articles: {
    all: ["articles"] as const,
    list: (status?: string) =>
      [...queryKeys.articles.all, "list", status ?? "all"] as const,
  },
  faqCategories: {
    all: ["faq-categories"] as const,
    list: () => [...queryKeys.faqCategories.all, "list"] as const,
  },
  faqs: {
    all: ["faqs"] as const,
    list: (categoryId?: string | number) =>
      [...queryKeys.faqs.all, "list", categoryId ?? "all"] as const,
  },
  testimonials: {
    all: ["testimonials"] as const,
    list: () => [...queryKeys.testimonials.all, "list"] as const,
  },
  partners: {
    all: ["partners"] as const,
    list: () => [...queryKeys.partners.all, "list"] as const,
  },
  inquiries: {
    all: ["inquiries"] as const,
    list: (status?: string) =>
      [...queryKeys.inquiries.all, "list", status ?? "all"] as const,
  },
  branches: {
    all: ["branches"] as const,
    list: () => [...queryKeys.branches.all, "list"] as const,
  },
  businessUnits: {
    all: ["business-units"] as const,
    list: () => [...queryKeys.businessUnits.all, "list"] as const,
  },
  sites: {
    all: ["sites"] as const,
    list: () => [...queryKeys.sites.all, "list"] as const,
  },
  users: {
    all: ["users"] as const,
    list: () => [...queryKeys.users.all, "list"] as const,
  },
} as const;
