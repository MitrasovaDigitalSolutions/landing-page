"use client";

import { Camera, ExternalLink } from "lucide-react";

interface InstagramPostCardProps {
  postUrl: string;
  handle: string;
  index: number;
}

function buildInstagramEmbedUrl(rawUrl: string): string {
  const clean = rawUrl.split("?")[0] ?? rawUrl;
  const normalized = clean.endsWith("/") ? clean : `${clean}/`;
  return `${normalized}embed/`;
}

export function InstagramPostCard({
  postUrl,
  handle,
  index,
}: InstagramPostCardProps): React.JSX.Element {
  const isReel = postUrl.includes("/reel/");
  const embedUrl = buildInstagramEmbedUrl(postUrl);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-primary/45 hover:shadow-md hover:shadow-primary/[0.08] hover:ring-1 hover:ring-primary/20">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Camera className="size-4 text-primary" />
          <span>@{handle}</span>
        </div>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-600 uppercase">
          {isReel ? "Reel" : "Post"}
        </span>
      </div>

      <iframe
        src={embedUrl}
        title={`Instagram ${isReel ? "Reel" : "Post"} ${index + 1} oleh @${handle}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[390px] w-full border-0 bg-slate-50"
      />

      <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2.5">
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <span>Buka di Instagram</span>
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </article>
  );
}
