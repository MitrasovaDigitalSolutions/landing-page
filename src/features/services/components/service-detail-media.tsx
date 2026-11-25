"use client";

import {
  Download as DownloadIcon,
  Expand,
  FileImage,
  Package,
} from "lucide-react";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { SmartImage } from "@/components/shared/smart-image";
import type { Service } from "@/types/api.types";
import { resolveMediaUrl } from "@/utils/media";

interface ServiceDetailMediaProps {
  service: Service;
  iconName?: string | null;
}

function buildDownloadFilename(slug: string, url: string): string {
  const pathPart = url.split("?")[0] ?? "";
  const dotIdx = pathPart.lastIndexOf(".");
  const ext = dotIdx >= 0 ? pathPart.slice(dotIdx) : "";
  const safeExt = /^\.[a-z0-9]{2,5}$/i.test(ext) ? ext.toLowerCase() : ".jpg";
  const safeSlug = slug.trim() || "produk";
  return `${safeSlug}${safeExt}`;
}

export function ServiceDetailMedia({
  service,
  iconName,
}: ServiceDetailMediaProps): React.JSX.Element {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imageUrl = resolveMediaUrl(
    service.thumbnail_url,
    service.thumbnail_path
  );

  if (!imageUrl) {
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

  const downloadFilename = buildDownloadFilename(service.slug, imageUrl);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-lg shadow-slate-900/[0.04] lg:col-span-6">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          <FileImage className="size-3.5 text-primary" />
          <span>Rincian Visual Produk</span>
        </span>
        <span className="text-[11px] font-medium text-slate-400">
          Klik gambar untuk zoom
        </span>
      </div>

      <div className="bg-slate-50/50 p-3 sm:p-4">
        <button
          type="button"
          onClick={() => {
            setLightboxOpen(true);
          }}
          aria-label={`Perbesar gambar ${service.name}`}
          className="group relative block aspect-4/3 w-full cursor-zoom-in overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70 outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <SmartImage
            src={service.thumbnail_url}
            fallbackPath={service.thumbnail_path}
            alt={service.name}
            fill
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-slate-900/75 px-3 py-1 text-[11px] font-semibold text-white opacity-0 shadow-sm backdrop-blur-xs transition-opacity group-hover:opacity-100">
            <Expand className="size-3" />
            <span>Zoom</span>
          </span>
        </button>
      </div>

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
            href={imageUrl}
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
        close={() => {
          setLightboxOpen(false);
        }}
        slides={[
          {
            src: imageUrl,
            alt: service.name,
            title: service.name,
            download: {
              url: imageUrl,
              filename: downloadFilename,
            },
          },
        ]}
        plugins={[Zoom, Download, Captions]}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
      />
    </div>
  );
}
