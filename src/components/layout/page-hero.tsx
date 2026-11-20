import { Container } from "@/components/layout/container";
import type { PageSectionStat } from "@/types/api.types";

interface PageHeroProps {
  badge?: string;
  title: string;
  description?: string | null;
  stats?: PageSectionStat[];
}

function getStatsGridClass(count: number): string {
  if (count === 1) {
    return "grid-cols-1";
  }
  if (count === 2) {
    return "grid-cols-2";
  }
  return "grid-cols-3";
}

export function PageHero({
  badge,
  title,
  description,
  stats = [],
}: PageHeroProps): React.JSX.Element {
  return (
    <section className="border-b border-slate-200/80 bg-gradient-to-b from-[#F4F8F5] to-white py-7 md:py-10">
      <Container>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            {badge ? (
              <div className="mb-2.5 inline-flex items-center gap-2.5">
                <span className="h-0.5 w-6 rounded-full bg-primary" />
                <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
                  {badge}
                </span>
              </div>
            ) : null}

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl lg:leading-[1.15]">
              {title}
            </h1>

            {description ? (
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:text-base">
                {description}
              </p>
            ) : null}
          </div>

          {stats.length > 0 ? (
            <dl
              className={`grid ${getStatsGridClass(stats.length)} divide-x divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-white shadow-xs`}
            >
              {stats.map((stat) => (
                <div
                  key={`${stat.label}-${stat.value}`}
                  className="px-5 py-3.5 text-center sm:px-6 sm:py-4"
                >
                  <dd className="text-xl font-extrabold tracking-tight text-primary tabular-nums sm:text-2xl">
                    {stat.value}
                  </dd>
                  <dt className="mt-0.5 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
