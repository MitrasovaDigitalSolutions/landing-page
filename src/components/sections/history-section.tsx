"use client";

import { motion } from "motion/react";
import { Container } from "@/components/layout/container";
import { SmartImage } from "@/components/shared/smart-image";
import type { PageSection } from "@/types/api.types";
import { resolvePayloadMediaUrl } from "@/utils/media";

export interface HistoryMilestone {
  year: string;
  label: string;
}

interface HistorySectionProps {
  section?: PageSection;
  milestones?: readonly HistoryMilestone[];
}

export function HistorySection({
  section,
  milestones = [],
}: HistorySectionProps): React.JSX.Element | null {
  if (!section?.body) {
    return null;
  }

  const paragraphs = section.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return null;
  }

  const imageSrc = resolvePayloadMediaUrl(
    section.payload?.image_path,
    section.payload?.image_url,
    section.image_url,
    section.image_path
  );
  const hasAsideContent = milestones.length > 0 || Boolean(imageSrc);

  return (
    <section className="border-b border-slate-200/80 bg-white py-9 md:py-12">
      <Container className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={hasAsideContent ? "lg:col-span-5" : "lg:col-span-12"}
        >
          <div className="mb-3 inline-flex items-center gap-2.5">
            <span className="h-0.5 w-6 rounded-full bg-primary" />
            <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
              {section.subtitle ?? "Perjalanan Lembaga"}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {section.title ?? "Sejarah Kami"}
          </h2>

          {milestones.length > 0 ? (
            <ol className="mt-6 space-y-3 border-l-2 border-primary/20 pl-4">
              {milestones.map((item) => (
                <li key={item.year} className="space-y-0.5">
                  <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary tabular-nums">
                    {item.year}
                  </span>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {item.label}
                  </p>
                </li>
              ))}
            </ol>
          ) : null}

          {imageSrc ? (
            <div className="relative mt-6 aspect-16/10 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-xs">
              <SmartImage
                src={imageSrc}
                alt={section.title ?? "Sejarah"}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className={hasAsideContent ? "space-y-5 lg:col-span-7" : "space-y-5 lg:col-span-12"}
        >
          {paragraphs.map((paragraph, index) => (
            <p
              key={`history-${index}`}
              className="text-base leading-relaxed text-slate-600"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
