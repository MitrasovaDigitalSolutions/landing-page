"use client";

import { Download as DownloadIcon, Expand, FileImage, Package } from "lucide-react";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { ServiceDetailStage } from "@/features/services/components/service-detail-stage";
import { ServiceDetailThumbnails } from "@/features/services/components/service-detail-thumbnails";
import type { Service } from "@/types/api.types";
import { resolveGalleryUrls, resolveMediaUrl } from "@/utils/media";

interface ServiceDetailMediaProps {
  service: Service;
  iconName?: string | null;
}

function buildDownloadFilename(slug: string, url: string, idx: number): string {
  const pathPart = url.split("?")[0] ?? "";
  const dotIdx = pathPart.lastIndexOf(".");
  const ext = dotIdx >= 0 ? pathPart.slice(dotIdx) : "";
  const safeExt = /^\.[a-z0-9]{2,5}$/i.test(ext) ? ext.toLowerCase() : ".jpg";
  const safeSlug = slug.trim() || "produk";
  return idx > 0 ? `${safeSlug}-${idx + 1}${safeExt}` : `${safeSlug}${safeExt}`;
}

export function ServiceDetailMedia({
  service,
  iconName,
}: ServiceDetailMediaProps): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const gallery = resolveGalleryUrls(service.image_urls, service.images);
  const thumbFallback = resolveMediaUrl(
    service.thumbnail_url,
    service.thumbnail_path
  );
  let slides = gallery;
  if (slides.length === 0) {
    slides = thumbFallback ? [thumbFallback] : [];
  }

  const firstSlide = slides[0];
  if (!firstSlide) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm lg:col-span-6">
        <div className="flex aspect-4/3 w-full flex-col items-center justify-center gap-2 bg-slate-50 text-slate-400">
          <DynamicIcon
            name={iconName}
            fallback={Package}
            className="size-16 stroke-[1.5]"
          />
          <span className="text-xs font-medium text-slate-400">
            Rincian visual belum tersedia
          </span>
        </div>
      </div>
    );
  }

  const safeIndex = activeIndex < slides.length ? activeIndex : 0;
  const activeUrl = slides[safeIndex] ?? firstSlide;
  const hasMultiple = slides.length > 1;
  const downloadFilename = buildDownloadFilename(
    service.slug,
    activeUrl,
    safeIndex
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-lg shadow-slate-900/[0.04] lg:col-span-6">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          <FileImage className="size-3.5 text-primary" />
          <span>Rincian Visual Produk</span>
        </span>
        <span className="text-[11px] font-medium text-slate-400 tabular-nums">
          {hasMultiple
            ? `Foto ${safeIndex + 1} / ${slides.length}`
            : "Klik gambar untuk zoom"}
        </span>
      </div>

      <ServiceDetailStage
        imageUrl={activeUrl}
        serviceName={service.name}
        slideIndex={safeIndex}
        hasMultiple={hasMultiple}
        onZoom={() => {
          setLightboxOpen(true);
        }}
        onPrev={() => {
          setActiveIndex((safeIndex - 1 + slides.length) % slides.length);
        }}
        onNext={() => {
          setActiveIndex((safeIndex + 1) % slides.length);
        }}
      />

      <ServiceDetailThumbnails
        slides={slides}
        serviceName={service.name}
        activeIndex={safeIndex}
        onSelect={setActiveIndex}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-white px-4 py-3">
        <span className="min-w-0 truncate text-xs font-semibold text-slate-700">
          {service.name}
        </span>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLightboxOpen(true);
            }}
            aria-label={`Perbesar gambar ${service.name}`}
            className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Expand className="size-3.5" />
            <span>Perbesar</span>
          </button>

          <a
            href={activeUrl}
            download={downloadFilename}
            aria-label={`Unduh gambar ${service.name}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-primary/25 bg-primary/5 px-3 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
          >
            <DownloadIcon className="size-3.5" />
            <span>Unduh</span>
          </a>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        index={safeIndex}
        close={() => {
          setLightboxOpen(false);
        }}
        on={{
          view: ({ index }) => {
            setActiveIndex(index);
          },
        }}
        slides={slides.map((url, idx) => ({
          src: url,
          alt: `${service.name} - ${idx + 1}`,
          title: hasMultiple
            ? `${service.name} (${idx + 1}/${slides.length})`
            : service.name,
          download: {
            url,
            filename: buildDownloadFilename(service.slug, url, idx),
          },
        }))}
        plugins={[Zoom, Download, Captions]}
        render={
          hasMultiple
            ? undefined
            : { buttonPrev: () => null, buttonNext: () => null }
        }
      />
    </div>
  );
}
