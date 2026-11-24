import { parseCommaList, toAbsoluteSiteUrl } from "@/lib/seo";
import type { Article, Faq, FaqRawItem, Service } from "@/types/api.types";
import type { SiteConfig } from "@/types/site.types";
import type { SiteSettings } from "@/types/site-settings.types";
import { resolveMediaUrl } from "@/utils/media";

const ALLOWED_SCHEMA_TYPES = new Set([
  "Organization",
  "FinancialService",
  "LocalBusiness",
  "ProfessionalService",
  "Store",
]);

function resolveSchemaType(rawType?: string): string {
  if (rawType && ALLOWED_SCHEMA_TYPES.has(rawType)) {
    return rawType;
  }
  return "Organization";
}

function stripHtmlTags(raw: string): string {
  return raw.replaceAll(/<[^>]+>/g, " ").replaceAll(/\s+/g, " ").trim();
}

function isFaqRecord(item: FaqRawItem): item is Faq {
  return (
    "question" in item &&
    typeof item.question === "string" &&
    "answer" in item &&
    typeof item.answer === "string"
  );
}

function collectFaqItems(rawFaqs: FaqRawItem[]): Faq[] {
  const collected: Faq[] = [];
  const seenIds = new Set<number>();

  for (const entry of rawFaqs) {
    if (isFaqRecord(entry)) {
      if (entry.is_active !== false && !seenIds.has(entry.id)) {
        seenIds.add(entry.id);
        collected.push(entry);
      }
      continue;
    }

    const nestedList = Array.isArray(entry.faqs) ? entry.faqs : [];
    for (const nested of nestedList) {
      if (
        typeof nested === "object" &&
        isFaqRecord(nested) &&
        nested.is_active !== false &&
        !seenIds.has(nested.id)
      ) {
        seenIds.add(nested.id);
        collected.push(nested);
      }
    }
  }

  return collected;
}

export function buildOrganizationJsonLd(params: {
  siteUrl: string;
  config: SiteConfig;
  settings: SiteSettings;
}): Record<string, unknown> {
  const { siteUrl, config, settings } = params;
  const name = settings.general?.site_title ?? config.name;
  const alternateNames = parseCommaList(settings.seo?.alternate_names);
  const logoUrl = toAbsoluteSiteUrl(
    resolveMediaUrl(settings.general?.logo_url, settings.general?.logo_path),
    siteUrl
  );
  const socialLinks = [
    settings.social?.instagram,
    settings.social?.facebook,
    settings.social?.linkedin,
    settings.social?.tiktok,
  ].filter((link): link is string => Boolean(link && /^https?:\/\//i.test(link)));

  return {
    "@context": "https://schema.org",
    "@type": resolveSchemaType(settings.seo?.schema_type),
    "@id": `${siteUrl}/#organization`,
    name,
    ...(alternateNames.length > 0 ? { alternateName: alternateNames } : {}),
    url: siteUrl,
    ...(logoUrl ? { logo: logoUrl } : {}),
    description:
      settings.seo?.meta_description ??
      settings.general?.tagline ??
      `Situs resmi ${name}`,
    ...(settings.contact?.phone ? { telephone: settings.contact.phone } : {}),
    ...(settings.contact?.email ? { email: settings.contact.email } : {}),
    ...(settings.contact?.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: settings.contact.address,
            addressCountry: "ID",
          },
        }
      : {}),
    ...(socialLinks.length > 0 ? { sameAs: socialLinks } : {}),
  };
}

export function buildWebSiteJsonLd(params: {
  siteUrl: string;
  config: SiteConfig;
  settings: SiteSettings;
}): Record<string, unknown> {
  const { siteUrl, config, settings } = params;
  const name = settings.general?.site_title ?? config.name;
  const alternateNames = parseCommaList(settings.seo?.alternate_names);

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name,
    ...(alternateNames.length > 0 ? { alternateName: alternateNames } : {}),
    inLanguage: "id-ID",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
  siteUrl: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: toAbsoluteSiteUrl(item.path, siteUrl) ?? siteUrl,
    })),
  };
}

export function buildFaqJsonLd(
  rawFaqs: FaqRawItem[]
): Record<string, unknown> | null {
  const items = collectFaqItems(rawFaqs);
  if (items.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtmlTags(faq.answer),
      },
    })),
  };
}

export function buildArticleJsonLd(params: {
  article: Article;
  siteUrl: string;
  publisherName: string;
  publisherLogo?: string;
}): Record<string, unknown> {
  const { article, siteUrl, publisherName, publisherLogo } = params;
  const imageUrl = toAbsoluteSiteUrl(
    resolveMediaUrl(article.thumbnail_url, article.thumbnail_path),
    siteUrl
  );
  const articleUrl = `${siteUrl}/articles/${article.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt ?? stripHtmlTags(article.body).slice(0, 160),
    mainEntityOfPage: articleUrl,
    url: articleUrl,
    ...(article.published_at ? { datePublished: article.published_at } : {}),
    ...(imageUrl ? { image: [imageUrl] } : {}),
    author: {
      "@type": article.author?.name ? "Person" : "Organization",
      name: article.author?.name ?? publisherName,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      ...(publisherLogo ? { logo: { "@type": "ImageObject", url: publisherLogo } } : {}),
    },
  };
}

export function buildServiceJsonLd(params: {
  service: Service;
  siteUrl: string;
  providerName: string;
}): Record<string, unknown> {
  const { service, siteUrl, providerName } = params;
  const imageUrl = toAbsoluteSiteUrl(
    resolveMediaUrl(service.thumbnail_url, service.thumbnail_path),
    siteUrl
  );

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.short_desc,
    url: `${siteUrl}/services/${service.slug}`,
    ...(imageUrl ? { image: imageUrl } : {}),
    provider: {
      "@type": "Organization",
      name: providerName,
      url: siteUrl,
    },
    ...(service.service_type?.name
      ? { serviceType: service.service_type.name }
      : {}),
    ...(service.price !== null &&
    service.price !== undefined &&
    Number.isFinite(service.price)
      ? {
          offers: {
            "@type": "Offer",
            price: service.price,
            priceCurrency: "IDR",
          },
        }
      : {}),
  };
}
