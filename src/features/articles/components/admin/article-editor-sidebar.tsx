"use client";

import { FormDatePicker } from "@/components/forms/form-date-picker";
import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormInputOption } from "@/components/forms/form-input-option";
import { FormTextarea } from "@/components/forms/form-textarea";
import type { Article, ArticleCategory } from "@/types/api.types";

export interface ArticleEditorValues {
  title: string;
  slug: string;
  article_category_id: string;
  status: "published" | "draft" | "archived";
  published_at: string;
  excerpt: string;
  body: string;
  thumbnail: File | null;
}

interface ArticleEditorSidebarProps {
  article: Article | null;
  categories: ArticleCategory[];
}

const STATUS_OPTIONS = [
  { value: "published", label: "Dipublikasikan" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Diarsipkan" },
];

export function ArticleEditorSidebar({
  article,
  categories,
}: ArticleEditorSidebarProps): React.JSX.Element {
  const categoryOptions = [
    { value: "", label: "Umum" },
    ...categories.map((cat) => ({ value: String(cat.id), label: cat.name })),
  ];

  return (
    <aside className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs xl:sticky xl:top-4">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-slate-900">
          Pengaturan Publikasi
        </h2>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Atur kategori, tanggal terbit, SEO slug, dan gambar sampul.
        </p>
      </div>

      <FormInputOption<ArticleEditorValues>
        name="status"
        label="Status Publikasi"
        searchable={false}
        options={STATUS_OPTIONS}
      />

      <FormInputOption<ArticleEditorValues>
        name="article_category_id"
        label="Kategori Artikel"
        options={categoryOptions}
      />

      <FormDatePicker<ArticleEditorValues>
        name="published_at"
        label="Tanggal Terbit"
        placeholder="Pilih tanggal terbit..."
      />

      <FormInput<ArticleEditorValues>
        name="slug"
        label="Slug URL (Opsional)"
        placeholder="Otomatis dari judul artikel"
      />

      <FormTextarea<ArticleEditorValues>
        name="excerpt"
        label="Ringkasan Singkat"
        placeholder="Cuplikan singkat untuk kartu artikel..."
        rows={3}
      />

      <FormImageUpload<ArticleEditorValues>
        name="thumbnail"
        label="Foto Sampul"
        initialUrl={article?.thumbnail_url ?? article?.thumbnail_path}
        maxSizeMB={10}
        aspectHint="16:9"
      />
    </aside>
  );
}
