import { Container } from "@/components/layout/container";
import { SmartImage } from "@/components/shared/smart-image";
import { resolveSectionStats } from "@/features/home/utils/section-normalizer";
import type { PageSection } from "@/types/api.types";
import { Award, Building2, TrendingUp, Users } from "lucide-react";
import Image from "next/image";

interface AboutStatsSectionProps {
  section: PageSection;
}

const STAT_ICONS = [Users, Award, TrendingUp, Building2];

export function AboutStatsSection({
  section,
}: AboutStatsSectionProps): React.JSX.Element {
  const stats = resolveSectionStats(section);
  const title = section.title ?? "Tentang Kami";
  const subtitle = section.subtitle ?? "Profil Institusi";
  const body = section.body ?? "";
  const hasImage = Boolean(section.image_url ?? section.image_path);

  return (
    <section id="about" className="border-b border-slate-200/70 bg-white py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="mb-3 inline-flex items-center gap-2.5">
              <span className="h-1 w-6 rounded-full bg-primary" />
              <span className="text-xs font-bold tracking-wider text-primary uppercase">
                {subtitle}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              {body}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((stat, idx) => {
                const Icon = STAT_ICONS[idx % STAT_ICONS.length];
                return (
                  <div
                    key={stat.label}
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
          </div>

          <div className="relative lg:col-span-6">
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/15 via-sky-300/15 to-transparent blur-2xl" />
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border-4 border-white bg-sky-50 shadow-xl shadow-primary/10">
              {hasImage ? (
                <SmartImage
                  src={section.image_url}
                  fallbackPath={section.image_path}
                  alt={title}
                  fill
                  className="object-cover"
                  fallbackClassName="bg-sky-50"
                  fallback={
                    <Image
                      src="/images/hero-corporate.jpg"
                      alt={title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  }
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
        </div>
      </Container>
    </section>
  );
}
