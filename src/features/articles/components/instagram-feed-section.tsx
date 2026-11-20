import { Camera, ExternalLink } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { InstagramLiveCard } from "@/features/articles/components/instagram-live-card";
import { InstagramPostCard } from "@/features/articles/components/instagram-post-card";
import type { InstagramMediaItem } from "@/features/articles/services/instagram.service";
import type { PageSection } from "@/types/api.types";

interface InstagramFeedSectionProps {
  section?: PageSection;
  livePosts?: InstagramMediaItem[];
}

export function InstagramFeedSection({
  section,
  livePosts = [],
}: InstagramFeedSectionProps): React.JSX.Element | null {
  const fallbackUrls = section?.payload?.posts ?? [];
  const hasLive = livePosts.length > 0;

  if (!hasLive && fallbackUrls.length === 0) {
    return null;
  }

  const handle = section?.payload?.handle ?? "kspmspersada";
  const profileUrl =
    section?.payload?.profile_url ?? `https://www.instagram.com/${handle}`;
  const title = section?.title ?? "Konten dari Instagram Resmi Kami";
  const count = hasLive ? livePosts.length : fallbackUrls.length;
  const body =
    section?.body ?? `Menampilkan ${count} postingan terbaru dari akun @${handle}`;

  return (
    <section className="bg-[#F7F9F7] py-8 md:py-12">
      <Container>
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <span className="h-0.5 w-6 rounded-full bg-primary" />
              <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
                Instagram Resmi @{handle}
              </span>
              {hasLive ? (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                  Sinkron Otomatis
                </span>
              ) : null}
            </div>

            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
              {title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {body}
            </p>
          </div>

          <Button
            variant="outline"
            size="default"
            nativeButton={false}
            className="h-10 shrink-0 gap-2 self-start rounded-xl border-slate-300 bg-white px-4 text-xs font-bold text-slate-800 hover:border-primary/40 hover:text-primary md:self-auto"
            render={
              <a href={profileUrl} target="_blank" rel="noopener noreferrer" />
            }
          >
            <Camera className="size-4 text-primary" />
            <span>Ikuti @{handle}</span>
            <ExternalLink className="size-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {hasLive
            ? livePosts.map((item) => (
                <InstagramLiveCard key={item.id} item={item} handle={handle} />
              ))
            : fallbackUrls.map((postUrl, idx) => (
                <InstagramPostCard
                  key={postUrl}
                  postUrl={postUrl}
                  handle={handle}
                  index={idx}
                />
              ))}
        </div>
      </Container>
    </section>
  );
}
