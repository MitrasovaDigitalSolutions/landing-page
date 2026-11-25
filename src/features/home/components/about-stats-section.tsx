import { Award, Building2, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { SmartImage } from "@/components/shared/smart-image";
import { resolveSectionStats } from "@/features/home/utils/section-normalizer";
import type { PageSection } from "@/types/api.types";
import { resolvePayloadMediaUrl } from "@/utils/media";

interface AboutStatsSectionProps {
  section: PageSection;
}

const STAT_ICONS = [Users, Award, TrendingUp, Building2];

export function AboutStatsSection({
  section,
}: AboutStatsSectionProps): React.JSX.Element | null {
  const stats = resolveSectionStats(section);
  const title = section.title ?? "Tentang Kami";
  const badge = section.payload?.badge ?? section.subtitle ?? "Profil Institusi";
  const body = section.body ?? "";
  const imageSrc = resolvePayloadMediaUrl(
    section.payload?.image_path,
    section.payload?.image_url,
    section.image_url,
    section.image_path
  );

  if (!section.title && !body && stats.length === 0 && !imageSrc) {
    return null;
  }

  const showVisualPanel = Boolean(imageSrc) || stats.length > 0;
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="about" className="border-b border-slate-200/70 bg-white py-12 md:py-20">
      <Container>
        <div
          className={
            showVisualPanel
              ? "grid grid-cols-1 items-center gap-10 lg:grid-cols-12"
              : "max-w-4xl"
          }
        >
          <div className={showVisualPanel ? "lg:col-span-6" : ""}>
            <div className="mb-3 inline-flex items-center gap-2.5">
              <span className="h-1 w-6 rounded-full bg-primary" />
              <span className="text-xs font-bold tracking-wider text-primary uppercase">
                {badge}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            {paragraphs.length > 0 ? (
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {paragraphs.map((text, idx) => (
                  <p key={`about-p-${idx}`}>{text}</p>
                ))}
              </div>
            ) : null}

            {stats.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((stat, idx) => {
                  const Icon = STAT_ICONS[idx % STAT_ICONS.length];
                  return (
                    <div
                      key={`${stat.label}-${idx}`}
                      className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-white to-sky-50/50 p-5 shadow-2xs"
                    >
                      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </div>
                      <div className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-slate-600">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          {showVisualPanel ? (
            <div className="relative lg:col-span-6">
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/15 via-sky-300/15 to-transparent blur-2xl" />
              <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border-4 border-white bg-sky-50 shadow-xl shadow-primary/10">
                {imageSrc ? (
                  <SmartImage
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover"
                    fallbackClassName="bg-sky-50"
                  />
                ) : (
                  <Image
                    src="/images/hero-corporate.jpg"
                    alt={title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
