"use client";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { normalizeFaqResponse } from "@/features/faq/utils/faq-normalizer";
import { cn } from "@/lib/utils";
import type { FaqRawItem } from "@/types/api.types";
import { useMemo, useState } from "react";

interface FaqSectionProps {
  faqs: FaqRawItem[];
}

export function FaqSection({ faqs }: FaqSectionProps): React.JSX.Element | null {
  const { faqs: normalizedFaqs, categories } = useMemo(
    () => normalizeFaqResponse(faqs),
    [faqs]
  );
  const [activeCategory, setActiveCategory] = useState("all");

  if (normalizedFaqs.length === 0) {
    return null;
  }

  const displayedFaqs =
    activeCategory === "all"
      ? normalizedFaqs
      : normalizedFaqs.filter((item) => item.category?.slug === activeCategory);

  const filterTabs = [
    { id: 0, name: `Semua Kategori (${normalizedFaqs.length})`, slug: "all" },
    ...categories,
  ];

  return (
    <section
      id="faq"
      className="border-b border-slate-200/80 bg-slate-50/60 py-10 md:py-14"
    >
      <Container className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading
            badge="Pusat Informasi"
            title="Pertanyaan yang Sering Diajukan"
            subtitle="Penjelasan prosedur keanggotaan, persyaratan pengajuan, dan ketentuan operasional."
            className="mb-6"
          />

          <div className="flex flex-wrap gap-2 lg:flex-col">
            {filterTabs.map((tab) => (
              <button
                key={tab.slug}
                type="button"
                onClick={() => {
                  setActiveCategory(tab.slug);
                }}
                className={cn(
                  "rounded-lg border px-4 py-2.5 text-left text-xs font-semibold transition-all",
                  activeCategory === tab.slug
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                )}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          <Accordion className="space-y-3">
            {displayedFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={String(faq.id)}
                className="rounded-xl border border-slate-200 bg-white px-6 py-1 shadow-2xs"
              >
                <AccordionTrigger className="text-left text-sm font-bold text-slate-900 hover:no-underline sm:text-base">
                  <span>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}
