"use client";

import { Compass } from "lucide-react";
import { motion } from "motion/react";
import { Container } from "@/components/layout/container";
import type { PageSection } from "@/types/api.types";

interface ProfileVisionMissionProps {
  section?: PageSection;
}

export function ProfileVisionMission({
  section,
}: ProfileVisionMissionProps): React.JSX.Element | null {
  const visi = section?.payload?.visi;
  const misi = section?.payload?.misi ?? [];

  if (!visi && misi.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-slate-200/80 bg-[#F7F9F7] py-9 md:py-12">
      <Container>
        <div className="mb-6 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2.5">
            <span className="h-0.5 w-6 rounded-full bg-primary" />
            <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
              Arah & Komitmen
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {section?.title ?? "Visi & Misi"}
          </h2>
        </div>

        {visi ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-primary p-7 text-white shadow-md sm:p-10"
          >
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-white/80 uppercase">
              <Compass className="size-4" />
              <span>Visi Kami</span>
            </div>
            <p className="mt-3 max-w-4xl text-xl leading-relaxed font-bold tracking-tight sm:text-2xl">
              {visi}
            </p>
          </motion.div>
        ) : null}

        {misi.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {misi.map((item, idx) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <span className="w-fit rounded-md bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-primary uppercase tabular-nums">
                  Misi {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-extrabold tracking-tight text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.desc}
                </p>
              </motion.article>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
