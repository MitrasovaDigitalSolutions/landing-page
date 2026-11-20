"use client";

import { motion } from "motion/react";
import { Container } from "@/components/layout/container";
import type { PageSection } from "@/types/api.types";

interface ProfileHistoryProps {
  section?: PageSection;
}

const MILESTONES = [
  {
    year: "2005",
    label: "21 Maret 2005 — Pendirian KSU Mitra Sejati dari peleburan 5 kelompok",
  },
  {
    year: "2006",
    label: "Memperoleh Badan Hukum awal Nomor 180/518/44 Tahun 2006",
  },
  {
    year: "2025",
    label: "Transformasi kelembagaan KSP Mitra Sejati Persada (AHU-0003640.AH.38.TAHUN 2025)",
  },
];

export function ProfileHistory({
  section,
}: ProfileHistoryProps): React.JSX.Element | null {
  if (!section?.body) {
    return null;
  }

  const paragraphs = section.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="border-b border-slate-200/80 bg-white py-9 md:py-12">
      <Container className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <div className="mb-3 inline-flex items-center gap-2.5">
            <span className="h-0.5 w-6 rounded-full bg-primary" />
            <span className="text-xs font-bold tracking-[0.14em] text-primary uppercase">
              Perjalanan Lembaga
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {section.title ?? "Sejarah Kami"}
          </h2>

          <ol className="mt-6 space-y-3 border-l-2 border-primary/20 pl-4">
            {MILESTONES.map((item) => (
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5 lg:col-span-7"
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
