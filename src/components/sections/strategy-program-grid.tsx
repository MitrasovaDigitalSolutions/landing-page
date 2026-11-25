import { CheckCircle2 } from "lucide-react";
import type { PageSectionListItem } from "@/types/api.types";

interface StrategyProgramGridProps {
  items: PageSectionListItem[];
}

export function StrategyProgramGrid({
  items,
}: StrategyProgramGridProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {items.map((item, idx) => {
        const points = [item.desc1, item.desc2, item.description].filter(
          (text): text is string => Boolean(text)
        );
        return (
          <article
            key={`${item.title}-${idx}`}
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-colors hover:border-primary/40"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-extrabold text-primary tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-extrabold tracking-tight text-slate-900">
                {item.title}
              </h3>
            </div>

            {points.length > 0 ? (
              <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
                {points.map((point, pointIdx) => (
                  <p
                    key={`${item.title}-pt-${pointIdx}`}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600"
                  >
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{point}</span>
                  </p>
                ))}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
