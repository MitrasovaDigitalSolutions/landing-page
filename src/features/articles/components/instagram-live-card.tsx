import { Calendar, Camera, ExternalLink } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import type { InstagramMediaItem } from "@/features/articles/services/instagram.service";
import { formatDateId } from "@/utils/format-date";

interface InstagramLiveCardProps {
  item: InstagramMediaItem;
  handle: string;
}

function getMediaTypeLabel(mediaType: InstagramMediaItem["media_type"]): string {
  if (mediaType === "VIDEO") {
    return "Reel / Video";
  }
  if (mediaType === "CAROUSEL_ALBUM") {
    return "Album";
  }
  return "Post";
}

export function InstagramLiveCard({
  item,
  handle,
}: InstagramLiveCardProps): React.JSX.Element {
  const imageSrc = item.thumbnail_url ?? item.media_url;
  const dateLabel = formatDateId(item.timestamp ?? null);
  const typeLabel = getMediaTypeLabel(item.media_type);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-primary/45 hover:shadow-md hover:shadow-primary/[0.08] hover:ring-1 hover:ring-primary/20">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Camera className="size-3.5 text-primary" />
          <span>@{handle}</span>
        </div>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-600 uppercase">
          {typeLabel}
        </span>
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-slate-100 bg-slate-100">
        <SmartImage
          src={imageSrc}
          alt={item.caption?.slice(0, 80) ?? `Postingan @${handle}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          fallbackClassName="bg-primary/5"
          fallback={<Camera className="size-8 text-primary/40" />}
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        {dateLabel ? (
          <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            <Calendar className="size-3 text-primary" />
            <span>{dateLabel}</span>
          </div>
        ) : null}

        <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
          {item.caption ?? `Publikasi resmi dari akun @${handle}.`}
        </p>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <a
            href={item.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <span>Lihat di Instagram</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
