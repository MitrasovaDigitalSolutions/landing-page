"use client";

import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";

interface ServiceDetailStageProps {
  imageUrl: string;
  serviceName: string;
  slideIndex: number;
  hasMultiple: boolean;
  onZoom: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function ServiceDetailStage({
  imageUrl,
  serviceName,
  slideIndex,
  hasMultiple,
  onZoom,
  onPrev,
  onNext,
}: ServiceDetailStageProps): React.JSX.Element {
  return (
    <div className="relative bg-slate-50/50 p-3 sm:p-4">
      <button
        type="button"
        onClick={onZoom}
        aria-label={`Perbesar gambar ${serviceName}`}
        className="group relative block aspect-4/3 w-full cursor-zoom-in overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70 outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <SmartImage
          src={imageUrl}
          alt={`${serviceName} (${slideIndex + 1})`}
          fill
          sizes="(max-width: 1024px) 100vw, 48vw"
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-slate-900/75 px-3 py-1 text-[11px] font-semibold text-white opacity-0 shadow-sm backdrop-blur-xs transition-opacity group-hover:opacity-100">
          <Expand className="size-3" />
          <span>Zoom</span>
        </span>
      </button>

      {hasMultiple ? (
        <>
          <button
            type="button"
            aria-label="Foto sebelumnya"
            onClick={onPrev}
            className="absolute top-1/2 left-5 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200/90 bg-white/90 text-slate-700 shadow-sm transition-colors hover:bg-white hover:text-primary"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Foto berikutnya"
            onClick={onNext}
            className="absolute top-1/2 right-5 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-slate-200/90 bg-white/90 text-slate-700 shadow-sm transition-colors hover:bg-white hover:text-primary"
          >
            <ChevronRight className="size-4" />
          </button>
        </>
      ) : null}
    </div>
  );
}
