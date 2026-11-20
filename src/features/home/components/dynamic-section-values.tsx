import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { DynamicOpeningsBlock } from "@/features/home/components/dynamic-openings-block";
import type { PageSection } from "@/types/api.types";

interface DynamicSectionValuesProps {
  section: PageSection;
}

export function DynamicSectionValues({
  section,
}: DynamicSectionValuesProps): React.JSX.Element | null {
  const items = section.payload?.items ?? [];
  const openings = section.payload?.openings;

  if (items.length === 0 && !Array.isArray(openings)) {
    return null;
  }

  return (
    <section
      id="konten"
      className="border-b border-slate-200/80 bg-white py-9 md:py-12"
    >
      <Container>
        <SectionHeading
          badge={section.payload?.badge ?? section.subtitle ?? "Keunggulan"}
          title={section.title ?? "Nilai & Program Utama"}
          subtitle={section.body ?? undefined}
        />

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, idx) => {
              const points = [item.desc1, item.desc2, item.description].filter(
                (t): t is string => Boolean(t)
              );
              return (
                <article
                  key={`${item.title}-${idx}`}
                  className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-primary/45 hover:shadow-md hover:shadow-primary/[0.08]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-extrabold text-primary tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base font-extrabold tracking-tight text-slate-900">
                      {item.title}
                    </h3>
                  </div>

                  {points.length === 1 ? (
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {points[0]}
                    </p>
                  ) : null}

                  {points.length > 1
                    ? points.map((pt, ptIdx) => (
                        <p
                          key={pt}
                          className={
                            ptIdx === 0
                              ? "mt-3 flex items-start gap-2 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-600 sm:text-sm"
                              : "mt-2 flex items-start gap-2 text-xs leading-relaxed text-slate-600 sm:text-sm"
                          }
                        >
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{pt}</span>
                        </p>
                      ))
                    : null}
                </article>
              );
            })}
          </div>
        ) : null}

        {Array.isArray(openings) ? (
          <DynamicOpeningsBlock openings={openings} />
        ) : null}
      </Container>
    </section>
  );
}
