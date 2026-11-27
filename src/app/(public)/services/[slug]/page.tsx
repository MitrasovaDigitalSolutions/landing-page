import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/shared/json-ld";
import { env } from "@/config/env";
import { resolveEffectiveModules, resolveSiteConfig } from "@/config/sites";
import { InquiryForm } from "@/features/inquiry/components/inquiry-form";
import { ServiceDetailBody } from "@/features/services/components/service-detail-body";
import { ServiceDetailHero } from "@/features/services/components/service-detail-hero";
import {
  getServiceBySlug,
  getServices,
} from "@/features/services/services/services.queries";
import {
  formatServicePrice,
  resolveServicesLayout,
} from "@/features/services/utils/service-display";
import { buildPageMetadata, resolveSiteUrl } from "@/lib/seo";
import {
  buildBreadcrumbJsonLd,
  buildServiceJsonLd,
} from "@/lib/seo-jsonld";
import { getSiteSettings } from "@/services/api/settings.service";
import { resolveGalleryUrls, resolveMediaUrl } from "@/utils/media";

export const instant = false;

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);
  const [service, settings] = await Promise.all([
    getServiceBySlug(slug, siteKey),
    getSiteSettings(siteKey),
  ]);

  const title = service?.name ?? "Detail Produk & Layanan";
  const imagePathOrUrl = service
    ? resolveMediaUrl(service.thumbnail_url, service.thumbnail_path)
    : null;

  return buildPageMetadata({
    title,
    description: service?.short_desc,
    path: `/services/${slug}`,
    siteUrl: resolveSiteUrl(settings),
    config,
    settings,
    imagePathOrUrl,
  });
}

function getDistinctBodyParagraphs(
  body: string | null,
  features: string[]
): string[] {
  if (!body) {
    return [];
  }
  const featureSet = new Set(features.map((f) => f.trim().toLowerCase()));
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => Boolean(line) && !featureSet.has(line.toLowerCase()));
}

function buildServiceStructuredData(
  service: NonNullable<Awaited<ReturnType<typeof getServiceBySlug>>>,
  siteUrl: string,
  providerName: string
): Record<string, unknown>[] {
  return [
    buildServiceJsonLd({ service, siteUrl, providerName }),
    buildBreadcrumbJsonLd(
      [
        { name: "Beranda", path: "/" },
        { name: "Produk & Layanan", path: "/produk" },
        { name: service.name, path: `/services/${service.slug}` },
      ],
      siteUrl
    ),
  ];
}

async function loadServiceViewData(slug: string, siteKey: string) {
  const [service, allServices, settings] = await Promise.all([
    getServiceBySlug(slug, siteKey),
    getServices({ perPage: 100 }, siteKey),
    getSiteSettings(siteKey),
  ]);
  const effectiveModules = resolveEffectiveModules(
    resolveSiteConfig(siteKey).modules,
    settings.modules?.is_active
  );
  if (!effectiveModules.services || !service) {
    notFound();
  }
  const features = service.features ?? [];
  const distinctBody = getDistinctBodyParagraphs(service.body, features);
  const waDigits = settings.contact?.whatsapp?.replaceAll(/\D/g, "");
  return {
    service,
    servicesLayout: resolveServicesLayout(settings.services?.layout),
    formattedPrice: formatServicePrice(service.price),
    iconName: service.service_type?.icon ?? service.service_type?.slug,
    typeLabel: service.service_type?.name ?? "Produk & Layanan",
    hasImage:
      resolveGalleryUrls(service.image_urls, service.images).length > 0 ||
      Boolean(resolveMediaUrl(service.thumbnail_url, service.thumbnail_path)),
    showContactSection: effectiveModules.contact,
    features,
    distinctBody,
    points: features.length > 0 ? features : distinctBody,
    siblingServices: allServices.filter(
      (s) => s.id !== service.id && s.service_type_id === service.service_type_id
    ),
    waUrl: waDigits
      ? `https://wa.me/${waDigits}?text=${encodeURIComponent(`Halo, saya ingin bertanya tentang ${service.name}.`)}`
      : null,
    structuredData: buildServiceStructuredData(
      service,
      resolveSiteUrl(settings),
      settings.general?.site_title ?? resolveSiteConfig(siteKey).name
    ),
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const {
    service,
    servicesLayout,
    formattedPrice,
    iconName,
    typeLabel,
    hasImage,
    showContactSection,
    features,
    distinctBody,
    points,
    siblingServices,
    waUrl,
    structuredData,
  } = await loadServiceViewData(slug, env.NEXT_PUBLIC_SITE_KEY);

  return (
    <div>
      <JsonLd data={structuredData} />

      <ServiceDetailHero
        service={service}
        typeLabel={typeLabel}
        iconName={iconName}
        showShowcaseHero={servicesLayout !== "accordion" || hasImage}
        formattedPrice={formattedPrice}
        waUrl={waUrl}
      />

      <ServiceDetailBody
        serviceName={service.name}
        typeLabel={typeLabel}
        servicesLayout={servicesLayout}
        points={points}
        features={features}
        distinctBody={distinctBody}
        siblingServices={siblingServices}
      />

      {showContactSection ? (
        <section
          id="konsultasi"
          className="border-t border-slate-200/80 bg-[#F7F9F7] py-10 md:py-14"
        >
          <Container>
            <InquiryForm
              orientation="horizontal"
              compact
              defaultSubject={`Konsultasi ${service.name}`}
              title={`Konsultasi & Pemesanan ${service.name}`}
              description="Isi formulir singkat di bawah ini atau hubungi tim kami langsung melalui WhatsApp untuk mendapatkan informasi detail."
              whatsappUrl={waUrl}
              whatsappLabel={`Tanya ${service.name} via WhatsApp`}
            />
          </Container>
        </section>
      ) : null}
    </div>
  );
}
