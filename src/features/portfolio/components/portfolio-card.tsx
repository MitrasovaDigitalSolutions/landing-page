import { SmartImage } from "@/components/shared/smart-image";
import { Card } from "@/components/ui/card";
import type { Portfolio } from "@/types/api.types";
import { formatDateId } from "@/utils/format-date";
import { resolveGalleryUrls } from "@/utils/media";
import { ArrowUpRight, Briefcase, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PortfolioCardProps {
  portfolio: Portfolio;
}

export function PortfolioCard({
  portfolio,
}: PortfolioCardProps): React.JSX.Element {
  const galleryCount = resolveGalleryUrls(
    portfolio.gallery_image_urls,
    portfolio.gallery_images
  ).length;
  const formattedDate =
    formatDateId(portfolio.completion_date) || portfolio.completion_date;

  const fallbackGraphic = (
    <Image
      src="/images/hero-corporate.jpg"
      alt={portfolio.title}
      fill
      unoptimized
      className="object-cover"
    />
  );

  return (
    <Card className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-0 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
      <div>
        <div className="relative aspect-16/10 w-full overflow-hidden border-b border-slate-100 bg-sky-50">
          <SmartImage
            src={portfolio.thumbnail_url}
            fallbackPath={portfolio.thumbnail_path}
            alt={portfolio.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fallbackClassName="bg-sky-50"
            fallback={fallbackGraphic}
          />
          {portfolio.service_type ? (
            <span className="absolute top-3 left-3 rounded-lg border border-white/80 bg-white/95 px-2.5 py-1 text-[10px] font-bold text-primary uppercase shadow-xs">
              {portfolio.service_type.name}
            </span>
          ) : null}
          {galleryCount > 0 ? (
            <span className="absolute right-3 bottom-3 rounded-lg bg-primary/90 px-2.5 py-0.5 text-[10px] font-semibold text-white">
              +{galleryCount} Foto
            </span>
          ) : null}
        </div>

        <div className="p-6">
          <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-primary">
            <Link href={`/portfolios/${portfolio.slug}`}>
              {portfolio.title}
            </Link>
          </h3>
          {portfolio.description ? (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
              {portfolio.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-6 py-3.5 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-3">
          {portfolio.client_name ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
              <Briefcase className="size-3.5 text-primary" />
              {portfolio.client_name}
            </span>
          ) : null}
          {formattedDate ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium">
              <Calendar className="size-3 text-slate-400" />
              {formattedDate}
            </span>
          ) : null}
        </div>
        <Link
          href={`/portfolios/${portfolio.slug}`}
          className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
        >
          <span>Detail</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </Card>
  );
}
