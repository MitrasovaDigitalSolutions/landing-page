"use client";

import { motion } from "motion/react";
import { Container } from "@/components/layout/container";
import type { PageSectionStat } from "@/types/api.types";

interface HeroStatsBarProps {
  stats: PageSectionStat[];
}

export function HeroStatsBar({
  stats,
}: HeroStatsBarProps): React.JSX.Element | null {
  if (stats.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-slate-200/80 bg-[#F7F9F7] py-6 md:py-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-slate-200/90 bg-white shadow-sm shadow-slate-900/[0.04]"
        >
          <dl className="grid grid-cols-2 divide-y divide-slate-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
            {stats.map((stat) => (
              <div
                key={`${stat.label}-${stat.value}`}
                className="flex flex-col justify-center px-5 py-4 sm:px-6 md:py-5"
              >
                <dd className="text-2xl font-extrabold tracking-tight text-primary tabular-nums sm:text-[28px]">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </motion.div>
      </Container>
    </div>
  );
}
