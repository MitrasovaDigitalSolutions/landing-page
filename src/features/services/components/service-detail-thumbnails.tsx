"use client";

import { SmartImage } from "@/components/shared/smart-image";
import { cn } from "@/lib/utils";

interface ServiceDetailThumbnailsProps {
  slides: string[];
  serviceName: string;
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function ServiceDetailThumbnails({
  slides,
  serviceName,
  activeIndex,
  onSelect,
}: ServiceDetailThumbnailsProps): React.JSX.Element | null {
  if (slides.length <= 1) {
    return null;
  }

  return (
    <div className="flex gap-2 overflow-x-auto border-t border-slate-100 bg-slate-50/40 px-3 py-2.5 sm:px-4">
      {slides.map((url, idx) => {
        const isActive = idx === activeIndex;
        return (
          <button
            key={`${url}-${idx}`}
            type="button"
            onClick={() => {
              onSelect(idx);
            }}
            aria-label={`Pilih foto ${idx + 1} ${serviceName}`}
            className={cn(
              "relative size-14 shrink-0 cursor-pointer overflow-hidden rounded-xl border bg-white transition-all",
              isActive
                ? "border-primary ring-2 ring-primary/25"
                : "border-slate-200 opacity-75 hover:opacity-100"
            )}
          >
            <SmartImage
              src={url}
              alt={`${serviceName} foto ${idx + 1}`}
              fill
              sizes="56px"
              className="object-cover"
            />
          </button>
        );
      })}
    </div>
  );
}
