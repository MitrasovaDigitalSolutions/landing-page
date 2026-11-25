"use client";

import { Download as DownloadIcon, Expand, Package } from "lucide-react";
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
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100 shadow-xs lg:col-span-5">
        <div className="flex size-full flex-col items-center justify-center bg-slate-100 text-slate-400">
          <DynamicIcon
            name={iconName}
            fallback={Package}
            className="size-16 stroke-[1.5]"
          />
        </div>

        {service.is_featured ? (
          <span className="absolute top-3 left-3 rounded-full border border-amber-200/90 bg-amber-50/95 px-3 py-1 text-[11px] font-bold tracking-wide text-amber-700 uppercase shadow-2xs backdrop-blur-xs">
            Unggulan
          </span>
        ) : null}
      </div>
    );
  }

  const downloadFilename = buildDownloadFilename(service.slug, imageUrl);

  return (
    <div className="group relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100 shadow-xs lg:col-span-5">
      <button
        type="button"
        onClick={() => {
          setLightboxOpen(true);
        }}
        aria-label={`Perbesar gambar ${service.name}`}
        className="relative block size-full cursor-zoom-in outline-none"
      >
        <SmartImage
          src={service.thumbnail_url}
          fallbackPath={service.thumbnail_path}
          alt={service.name}
          fill
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </button>

      {service.is_featured ? (
        <span className="pointer-events-none absolute top-3 left-3 rounded-full border border-amber-200/90 bg-amber-50/95 px-3 py-1 text-[11px] font-bold tracking-wide text-amber-700 uppercase shadow-2xs backdrop-blur-xs">
          Unggulan
        </span>
      ) : null}

      <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            setLightboxOpen(true);
          }}
          aria-label={`Zoom gambar ${service.name}`}
          className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/95 px-2.5 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-xs transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Expand className="size-3.5" />
          <span>Perbesar</span>
        </button>

        <a
          href={imageUrl}
          download={downloadFilename}
          aria-label={`Unduh gambar ${service.name}`}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/95 px-2.5 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-xs transition-colors hover:border-primary/40 hover:text-primary"
        >
          <DownloadIcon className="size-3.5" />
          <span>Unduh</span>
        </a>
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
