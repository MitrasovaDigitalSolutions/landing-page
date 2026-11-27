import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "@/config/env";
import { resolveSiteConfig } from "@/config/sites";
import { PartnerDetailView } from "@/features/partners/components/partner-detail-view";
import { getPartners } from "@/features/partners/services/partners.queries";
import { buildPageMetadata, resolveSiteUrl } from "@/lib/seo";
import { getSiteSettings } from "@/services/api/settings.service";
import { resolveMediaUrl } from "@/utils/media";

export const instant = false;

interface PartnerDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PartnerDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const partnerId = Number(id);
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);

  const [partners, settings] = await Promise.all([
    getPartners(siteKey),
    getSiteSettings(siteKey),
  ]);

  const partner = Number.isInteger(partnerId)
    ? partners.find((item) => item.id === partnerId)
    : undefined;

  return buildPageMetadata({
    title: partner ? `Mitra: ${partner.name}` : "Detail Mitra",
    description: partner
      ? `Informasi kontak & tautan resmi ${partner.name}, mitra terverifikasi ${settings.general?.site_title ?? config.name}.`
      : undefined,
    path: `/mitra/${id}`,
    siteUrl: resolveSiteUrl(settings),
    config,
    settings,
    imagePathOrUrl: partner
      ? resolveMediaUrl(partner.logo_url, partner.logo_path)
      : null,
  });
}

export default async function PartnerDetailPage({
  params,
}: PartnerDetailPageProps): Promise<React.JSX.Element> {
  const { id } = await params;
  const partnerId = Number(id);
  if (!Number.isInteger(partnerId) || partnerId <= 0) {
    notFound();
  }

  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);
  const [partners, settings] = await Promise.all([
    getPartners(siteKey),
    getSiteSettings(siteKey),
  ]);

  const partner = partners.find((item) => item.id === partnerId);
  if (!partner) {
    notFound();
  }

  const siteName = settings.general?.site_title ?? config.name;
  const siteUrl = resolveSiteUrl(settings);
  const otherPartners = partners
    .filter((item) => item.id !== partner.id)
    .slice(0, 8);

  return (
    <PartnerDetailView
      partner={partner}
      otherPartners={otherPartners}
      siteName={siteName}
      siteUrl={siteUrl}
    />
  );
}
