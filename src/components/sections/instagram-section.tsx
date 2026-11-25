import { Camera, ExternalLink } from "lucide-react";
import { Container } from "@/components/layout/container";
import { InstagramPostEmbedCard } from "@/components/sections/instagram-post-embed-card";
import { Button } from "@/components/ui/button";
import type { PageSection } from "@/types/api.types";

interface InstagramSectionProps {
  section?: PageSection;
}

export function InstagramSection({
  section,
}: InstagramSectionProps): React.JSX.Element | null {
  const posts = section?.payload?.posts ?? [];
  const rawHandle = section?.payload?.handle;
  const rawProfileUrl = section?.payload?.profile_url;

  if (posts.length === 0 && !rawHandle && !rawProfileUrl) {
    return null;
  }

  const handle = rawHandle ?? "instagram";
  const profileUrl = rawProfileUrl ?? `https://www.instagram.com/${handle}`;
  const title = section?.title ?? "Feed Instagram Resmi";
  const body =
    section?.body ??
    (posts.length > 0
      ? `Menampilkan ${posts.length} postingan pilihan dari akun @${handle}.`
      : `Ikuti pembaruan terbaru langsung di Instagram resmi @${handle}.`);

  return (
    <section className="border-b border-slate-200/80 bg-[#F7F9F7] py-9 md:py-12">
      <Container>
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <span className="h-0.5 w-6 rounded-full bg-primary" />
              <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
                Instagram Resmi @{handle}
              </span>
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

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((postUrl, idx) => (
              <InstagramPostEmbedCard
                key={`${postUrl}-${idx}`}
                postUrl={postUrl}
                handle={handle}
                index={idx}
              />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
