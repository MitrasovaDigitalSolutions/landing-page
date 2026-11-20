"use client";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ArticleCard } from "@/features/articles/components/article-card";
import { cn } from "@/lib/utils";
import type { Article, ArticleCategory } from "@/types/api.types";
import { useState } from "react";

interface ArticlesSectionProps {
  articles: Article[];
  categories?: ArticleCategory[];
}

export function ArticlesSection({
  articles,
  categories = [],
}: ArticlesSectionProps): React.JSX.Element | null {
  const [selectedCategory, setSelectedCategory] = useState("all");

  if (articles.length === 0) {
    return null;
  }

  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((a) => a.category?.slug === selectedCategory);

  return (
    <section
      id="articles"
      className="border-b border-slate-200/80 bg-white py-8 md:py-12"
    >
      <Container>
        <SectionHeading
          badge="Wawasan & Edukasi"
          title="Publikasi & Artikel Terkini"
          subtitle="Referensi analisis keuangan, panduan pengelolaan usaha, dan informasi resmi bagi anggota serta mitra."
        />

        {categories.length > 0 ? (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
              }}
              className={cn(
                "rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                selectedCategory === "all"
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/40 hover:text-primary"
              )}
            >
              Semua Topik ({articles.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.slug);
                }}
                className={cn(
                  "rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  selectedCategory === cat.slug
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/40 hover:text-primary"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </Container>
    </section>
  );
}
