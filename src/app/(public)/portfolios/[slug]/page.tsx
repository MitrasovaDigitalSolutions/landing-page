import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/shared/json-ld";
import { SmartImage } from "@/components/shared/smart-image";
import { env } from "@/config/env";
import { resolveEffectiveModules, resolveSiteConfig } from "@/config/sites";
import { InquirySection } from "@/features/inquiry/components/inquiry-section";
import { getPortfolioBySlug } from "@/features/portfolio/services/portfolio.queries";
import { buildPageMetadata, resolveSiteUrl } from "@/lib/seo";
import { buildBreadcrumbJsonLd } from "@/lib/seo-jsonld";
import { getSiteSettings } from "@/services/api/settings.service";
import { formatDateId } from "@/utils/format-date";
import { resolveGalleryUrls, resolveMediaUrl } from "@/utils/media";
import { ArrowLeft, Briefcase, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const instant = false;

interface PortfolioDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const config = resolveSiteConfig(siteKey);
  const [portfolio, settings] = await Promise.all([
    getPortfolioBySlug(slug, siteKey),
    getSiteSettings(siteKey),
  ]);

  const title = portfolio?.title ?? "Detail Portofolio";
  const imagePathOrUrl = portfolio
    ? resolveMediaUrl(portfolio.thumbnail_url, portfolio.thumbnail_path)
    : null;

  return buildPageMetadata({
    title,
    description: portfolio?.description,
    path: `/portfolios/${slug}`,
    siteUrl: resolveSiteUrl(settings),
    config,
    settings,
    imagePathOrUrl,
  });
}

export default async function PortfolioDetailPage({
  params,
}: PortfolioDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const siteKey = env.NEXT_PUBLIC_SITE_KEY;
  const [portfolio, settings] = await Promise.all([
    getPortfolioBySlug(slug, siteKey).catch(() => null),
    getSiteSettings(siteKey),
  ]);

  const effectiveModules = resolveEffectiveModules(
    resolveSiteConfig(siteKey).modules,
    settings.modules?.is_active
  );

  if (!effectiveModules.portfolios || !portfolio) {
    notFound();
  }

  const galleryUrls = resolveGalleryUrls(
    portfolio.gallery_image_urls,
    portfolio.gallery_images
  );
  const formattedDate =
    formatDateId(portfolio.completion_date) || portfolio.completion_date;
  const siteUrl = resolveSiteUrl(settings);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    [
      { name: "Beranda", path: "/" },
      { name: "Portofolio", path: "/#portfolios" },
      { name: portfolio.title, path: `/portfolios/${portfolio.slug}` },
    ],
    siteUrl
  );

  return (
    <div>
      <JsonLd data={breadcrumbJsonLd} />
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-primary/8 via-sky-50/50 to-white py-14 md:py-20">
        <Container>
          <Link
            href="/#portfolios"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5" />
            <span>Kembali ke Daftar Portofolio</span>
          </Link>

          <div className="mt-6 max-w-3xl">
            {portfolio.service_type ? (
              <span className="inline-block rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-bold tracking-wider text-primary uppercase">
                {portfolio.service_type.name}
              </span>
            ) : null}

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {portfolio.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-600">
              {portfolio.client_name ? (
                <span className="inline-flex items-center gap-2">
                  <Briefcase className="size-4 text-primary" />
                  Klien: {portfolio.client_name}
                </span>
              ) : null}
              {formattedDate ? (
                <span className="inline-flex items-center gap-2">
                  <Calendar className="size-4 text-primary" />
                  Selesai: {formattedDate}
                </span>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-slate-200/80 bg-white py-14 md:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border-4 border-white bg-sky-50 shadow-xl shadow-primary/10 lg:col-span-7">
              <SmartImage
                src={portfolio.thumbnail_url}
                fallbackPath={portfolio.thumbnail_path}
                alt={portfolio.title}
                fill
                className="object-cover"
                fallbackClassName="bg-sky-50"
                fallback={
                  <Image
                    src="/images/hero-corporate.jpg"
                    alt={portfolio.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                }
              />
            </div>

            <div className="lg:col-span-5">
              <h2 className="text-xl font-bold text-slate-900">
                Ringkasan Studi Kasus & Implementasi
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">
                {portfolio.description ??
                  "Dokumentasi proyek dan kemitraan strategis unit bisnis Mitrasova."}
              </p>
            </div>
          </div>

          {galleryUrls.length > 0 ? (
            <div className="mt-14 border-t border-slate-200 pt-10">
              <h3 className="text-lg font-bold text-slate-900">
                Galeri Dokumentasi Proyek
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleryUrls.map((imgUrl, index) => (
                  <div
                    key={imgUrl}
                    className="relative aspect-4/3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                  >
                    <SmartImage
                      src={imgUrl}
                      alt={`${portfolio.title} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </section>

      {effectiveModules.contact ? (
        <InquirySection
          contact={settings.contact}
          defaultSubject={`Konsultasi Proyek: ${portfolio.title}`}
        />
      ) : null}
    </div>
  );
}
