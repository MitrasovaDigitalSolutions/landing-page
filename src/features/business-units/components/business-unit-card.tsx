"use client";

import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SmartImage } from "@/components/shared/smart-image";
import { BusinessUnitActions } from "@/features/business-units/components/business-unit-actions";
import type { BusinessUnit } from "@/types/api.types";
import { resolveGalleryUrls, resolveMediaUrl } from "@/utils/media";

interface BusinessUnitCardProps {
  unit: BusinessUnit;
  index: number;
}

function resolveUnitPhotos(unit: BusinessUnit): string[] {
  const gallery = resolveGalleryUrls(unit.image_urls, unit.images);
  const cover = resolveMediaUrl(unit.image_url, unit.image_path);
  if (cover && !gallery.includes(cover)) {
    return [cover, ...gallery];
  }
  return gallery;
}

function parseAddressAndPhone(rawAddress: string | null): {
  address: string;
  phone: string | null;
} {
  if (!rawAddress) {
    return { address: "", phone: null };
  }
  const parts = rawAddress
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1] ?? "";
    if (/^[+\d\s\-()]{7,}$/.test(lastPart)) {
      return {
        address: parts.slice(0, -1).join(", "),
        phone: lastPart,
      };
    }
  }
  return { address: rawAddress, phone: null };
}

function inferUnitSector(name: string, url: string | null): string {
  const combined = `${name} ${url ?? ""}`.toLowerCase();
  if (combined.includes("trans")) return "Transportasi";
  if (combined.includes("grosir")) return "Grosir & Ritel";
  if (combined.includes("percetakan")) return "Percetakan";
  if (combined.includes("estetika") || combined.includes("las")) {
    return "Las & Interior";
  }
  if (combined.includes("digital") || combined.includes("teknologi")) {
    return "Teknologi Digital";
  }
  if (combined.includes("konveksi")) return "Konveksi";
  return "Unit Usaha";
}

function extractHostname(url: string | null): string | null {
  if (!url) {
    return null;
  }
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export function BusinessUnitCard({
  unit,
  index,
}: BusinessUnitCardProps): React.JSX.Element {
  const photos = resolveUnitPhotos(unit);
  const [photoIdx, setPhotoIdx] = useState(0);
  const activePhoto = photos[photoIdx];
  const hasMultiplePhotos = photos.length > 1;
  const { address, phone } = parseAddressAndPhone(unit.address);
  const sectorLabel = inferUnitSector(unit.name, unit.url);
  const hostname = extractHostname(unit.url);

  const handlePrevPhoto = (): void => {
    setPhotoIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = (): void => {
    setPhotoIdx((prev) => (prev + 1) % photos.length);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index, 5) * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-primary/45 hover:shadow-md hover:shadow-primary/[0.08] hover:ring-1 hover:ring-primary/20 sm:flex-row"
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-slate-100 bg-slate-100 sm:aspect-auto sm:w-44 sm:border-r sm:border-b-0 md:w-52">
        <SmartImage
          src={activePhoto}
          alt={unit.name}
          fill
          sizes="(max-width: 640px) 100vw, 220px"
          className="object-cover"
          fallbackClassName="bg-primary/5"
          fallback={<Briefcase className="size-8 text-primary/40" />}
        />

        {hasMultiplePhotos ? (
          <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1 rounded-full border border-white/25 bg-slate-950/60 px-2 py-0.5 text-white backdrop-blur-xs">
            <button
              type="button"
              aria-label="Foto unit sebelumnya"
              onClick={handlePrevPhoto}
              className="cursor-pointer rounded-full p-0.5 hover:bg-white/20"
            >
              <ChevronLeft className="size-3" />
            </button>
            <span className="px-1 text-[10px] font-bold tabular-nums">
              {photoIdx + 1}/{photos.length}
            </span>
            <button
              type="button"
              aria-label="Foto unit berikutnya"
              onClick={handleNextPhoto}
              className="cursor-pointer rounded-full p-0.5 hover:bg-white/20"
            >
              <ChevronRight className="size-3" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-primary uppercase">
              {sectorLabel}
            </span>
            {hostname ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                <Globe className="size-3" />
                <span>{hostname}</span>
              </span>
            ) : null}
          </div>

          <h3 className="mt-2 text-base font-extrabold tracking-tight text-slate-900">
            {unit.name}
          </h3>

          {address || phone ? (
            <div className="mt-2.5 space-y-1.5 text-xs text-slate-600">
              {address ? (
                <p className="flex items-start gap-2 leading-relaxed">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  <span>{address}</span>
                </p>
              ) : null}
              {phone ? (
                <a
                  href={`tel:${phone.replaceAll(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-2 font-semibold text-slate-700 transition-colors hover:text-primary"
                >
                  <Phone className="size-3.5 shrink-0 text-primary" />
                  <span>{phone}</span>
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <BusinessUnitActions
          unitName={unit.name}
          unitUrl={unit.url}
          address={address}
        />
      </div>
    </motion.article>
  );
}
