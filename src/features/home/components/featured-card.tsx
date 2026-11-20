"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  HandCoins,
  Landmark,
  PiggyBank,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { PageSectionFeaturedCard, Service } from "@/types/api.types";

interface FeaturedCardProps {
  card: PageSectionFeaturedCard;
  index: number;
  services?: Service[];
}

type CategoryKind = "simpanan" | "pinjaman" | "default";

function getCategoryKind(title: string): CategoryKind {
  const lower = title.toLowerCase();
  if (lower.includes("simpan")) return "simpanan";
  if (lower.includes("pinjam") || lower.includes("kredit")) return "pinjaman";
  return "default";
}

export function FeaturedCard({
  card,
  index,
  services = [],
}: FeaturedCardProps): React.JSX.Element {
  const categoryKind = getCategoryKind(card.title);
  const indexLabel = String(index + 1).padStart(2, "0");
  const products = card.products ?? [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <span className="inline-block rounded-md bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-primary uppercase tabular-nums">
            Kategori {indexLabel}
          </span>
          <h3 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            {card.title}
          </h3>
        </div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-primary">
          {categoryKind === "simpanan" ? <PiggyBank className="size-5" /> : null}
          {categoryKind === "pinjaman" ? <HandCoins className="size-5" /> : null}
          {categoryKind === "default" ? <Landmark className="size-5" /> : null}
        </div>
      </div>

      {card.description ? (
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {card.description}
        </p>
      ) : null}

      {products.length > 0 ? (
        <ul className="mt-6 flex-1 divide-y divide-slate-100 border-t border-slate-100">
          {products.map((productName) => {
            const matched = services.find(
              (srv) => srv.name.toLowerCase() === productName.toLowerCase()
            );
            return (
              <li key={productName}>
                {matched ? (
                  <Link
                    href={`/services/${matched.slug}`}
                    className="group flex items-center justify-between gap-3 py-3 text-sm font-semibold text-slate-800 transition-colors hover:text-primary"
                  >
                    <span className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 shrink-0 text-primary" />
                      <span>{productName}</span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </Link>
                ) : (
                  <div className="flex items-center gap-2.5 py-3 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    <span>{productName}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}

      {card.note ? (
        <p className="mt-5 rounded-xl border-l-2 border-primary bg-slate-50 px-3.5 py-2.5 text-xs leading-relaxed text-slate-600">
          {card.note}
        </p>
      ) : null}
    </motion.article>
  );
}
