"use client";

import { Edit2, Image as ImageIcon, Trash2 } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PageSection, PageSectionPayload } from "@/types/api.types";
import { resolveMediaUrl } from "@/utils/media";

interface PageSectionCardProps {
  section: PageSection;
  onEdit: (section: PageSection) => void;
  onDelete: (section: PageSection) => void;
}

function summarizePayloadKeys(payload: PageSectionPayload | null): string[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }
  const summary: string[] = [];
  for (const [key, value] of Object.entries(payload)) {
    if (value === null || value === undefined || value === "") {
      continue;
    }
    if (Array.isArray(value)) {
      summary.push(`${key} (${value.length})`);
    } else {
      summary.push(key);
    }
  }
  return summary;
}

export function PageSectionCard({
  section,
  onEdit,
  onDelete,
}: PageSectionCardProps): React.JSX.Element {
  const imageUrl = resolveMediaUrl(section.image_url, section.image_path);
  const payloadKeys = summarizePayloadKeys(section.payload);

  return (
    <Card className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-colors hover:border-slate-300 sm:p-5">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 tabular-nums">
              #{section.order}
            </span>
            <Badge
              variant="secondary"
              className="rounded-md font-mono text-[10px] font-bold text-primary"
            >
              {section.key}
            </Badge>
            {section.subtitle ? (
              <span className="truncate rounded-md bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary">
                {section.subtitle}
              </span>
            ) : null}
          </div>

          <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
            {section.title ?? "(Tanpa judul)"}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Edit section ${section.key}`}
            onClick={() => {
              onEdit(section);
            }}
            className="text-amber-600 hover:bg-amber-50 hover:text-amber-700"
          >
            <Edit2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Hapus section ${section.key}`}
            onClick={() => {
              onDelete(section);
            }}
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-3">
        {imageUrl ? (
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <SmartImage
              src={imageUrl}
              alt={section.title ?? section.key}
              fill
              sizes="56px"
              className="object-cover"
              fallback={<ImageIcon className="size-4 text-slate-300" />}
            />
          </div>
        ) : null}

        <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-slate-600">
          {section.body ?? "Tidak ada deskripsi teks pada section ini."}
        </p>
      </div>

      {payloadKeys.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2.5">
          <span className="text-[10px] font-semibold text-slate-400">
            Payload:
          </span>
          {payloadKeys.map((chip) => (
            <span
              key={chip}
              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600"
            >
              {chip}
            </span>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
