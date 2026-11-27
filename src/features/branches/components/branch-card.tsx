"use client";

import {
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SmartImage } from "@/components/shared/smart-image";
import { Button } from "@/components/ui/button";
import type { Branch } from "@/types/api.types";
import { resolveDirectMapsUrl } from "@/utils/maps";
import { resolveMediaUrl } from "@/utils/media";
import { resolveBranchWhatsappDigits } from "@/utils/whatsapp";

interface BranchCardProps {
  branch: Branch;
  index: number;
}

function resolveBranchPhotos(branch: Branch): string[] {
  const fromUrls = (branch.image_urls ?? []).filter(Boolean);
  if (fromUrls.length > 0) {
    return fromUrls;
  }
  return (branch.images ?? [])
    .map((path) => resolveMediaUrl(null, path))
    .filter((url): url is string => Boolean(url));
}

function buildBranchWhatsappUrl(branch: Branch): string | null {
  const digits = resolveBranchWhatsappDigits(branch);
  if (!digits) {
    return null;
  }
  const text = `Halo *${branch.name}*, saya ingin bertanya mengenai layanan yang tersedia.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function BranchCard({
  branch,
  index,
}: BranchCardProps): React.JSX.Element {
  const photos = resolveBranchPhotos(branch);
  const [photoIdx, setPhotoIdx] = useState(0);
  const activePhoto = photos[photoIdx];
  const hasMultiplePhotos = photos.length > 1;
  const waUrl = buildBranchWhatsappUrl(branch);
  const mapsUrl = resolveDirectMapsUrl(
    branch.maps_embed,
    `${branch.name} ${branch.address}`
  );

  const handlePrevPhoto = (): void => {
    setPhotoIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = (): void => {
    setPhotoIdx((prev) => (prev + 1) % photos.length);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index, 5) * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-primary/45 hover:shadow-md hover:shadow-primary/[0.08] hover:ring-1 hover:ring-primary/20"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-slate-100 bg-slate-100">
        <SmartImage
          src={activePhoto}
          alt={branch.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          fallbackClassName="bg-primary/5"
          fallback={<Building2 className="size-10 text-primary/40" />}
        />

        <span
          className={
            branch.is_primary
              ? "absolute top-3 left-3 rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-xs"
              : "absolute top-3 left-3 rounded-lg border border-white/80 bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-700 uppercase shadow-xs"
          }
        >
          {branch.is_primary ? "Kantor Pusat" : "Kantor Cabang"}
        </span>

        {hasMultiplePhotos ? (
          <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full border border-white/25 bg-slate-950/60 px-2 py-1 text-white backdrop-blur-xs">
            <button
              type="button"
              aria-label="Foto cabang sebelumnya"
              onClick={handlePrevPhoto}
              className="cursor-pointer rounded-full p-0.5 hover:bg-white/20"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="px-1 text-[10px] font-bold tabular-nums">
              {photoIdx + 1}/{photos.length}
            </span>
            <button
              type="button"
              aria-label="Foto cabang berikutnya"
              onClick={handleNextPhoto}
              className="cursor-pointer rounded-full p-0.5 hover:bg-white/20"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
          {branch.name}
        </h3>

        <div className="mt-2.5 space-y-2">
          <p className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{branch.address}</span>
          </p>

          {branch.phone ? (
            <a
              href={`tel:${branch.phone.replaceAll(/[^0-9+]/g, "")}`}
              className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 transition-colors hover:text-primary sm:text-sm"
            >
              <Phone className="size-4 shrink-0 text-primary" />
              <span>{branch.phone}</span>
            </a>
          ) : null}

          {branch.whatsapp ? (
            <p className="flex items-center gap-2.5 text-xs font-semibold text-emerald-700 sm:text-sm">
              <MessageCircle className="size-4 shrink-0 text-emerald-600" />
              <span>WhatsApp: {branch.whatsapp}</span>
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {waUrl ? (
            <Button
              size="sm"
              nativeButton={false}
              className="h-9 flex-1 justify-center gap-1.5 rounded-xl text-xs font-bold shadow-xs"
              render={
                <a href={waUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              <MessageCircle className="size-3.5" />
              <span>Chat WhatsApp</span>
            </Button>
          ) : null}

          {mapsUrl ? (
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              className="h-9 flex-1 justify-center gap-1.5 rounded-xl border-slate-200 text-xs font-bold text-slate-700 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              render={
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              <span>Petunjuk Arah</span>
              <ExternalLink className="size-3.5" />
            </Button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
