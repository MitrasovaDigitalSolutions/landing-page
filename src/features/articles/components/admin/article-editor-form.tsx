"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Save, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { FormRichText } from "@/components/forms/form-rich-text";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  ArticleEditorSidebar,
  type ArticleEditorValues,
} from "@/features/articles/components/admin/article-editor-sidebar";
import { saveArticleAction } from "@/features/articles/services/articles.actions";
import { queryKeys } from "@/lib/query-keys";
import type { Article, ArticleCategory } from "@/types/api.types";
import { normalizeArticleBodyInput } from "@/utils/sanitize-html";

interface ArticleEditorFormProps {
  article: Article | null;
  categories: ArticleCategory[];
}

function getInitialValues(
  article: Article | null,
  categories: ArticleCategory[]
): ArticleEditorValues {
  const fallbackCatId = categories[0] ? String(categories[0].id) : "";
  return {
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    article_category_id: article?.article_category_id
      ? String(article.article_category_id)
      : fallbackCatId,
    status: article?.status ?? "published",
    published_at: article?.published_at ? article.published_at.slice(0, 10) : "",
    excerpt: article?.excerpt ?? "",
    body: normalizeArticleBodyInput(article?.body),
    thumbnail: null,
  };
}

function buildArticleFormData(values: ArticleEditorValues): FormData {
  const fd = new FormData();
  fd.append("title", values.title.trim());
  if (values.slug.trim()) fd.append("slug", values.slug.trim());
  if (values.article_category_id) {
    fd.append("article_category_id", values.article_category_id);
  }
  fd.append("status", values.status);
  fd.append("excerpt", values.excerpt);
  fd.append("body", values.body);
  if (values.published_at) fd.append("published_at", values.published_at);
  if (values.thumbnail instanceof File && values.thumbnail.size > 0) {
    fd.append("thumbnail", values.thumbnail);
  }
  return fd;
}

export function ArticleEditorForm({
  article,
  categories,
}: ArticleEditorFormProps): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();

  const methods = useForm<ArticleEditorValues>({
    defaultValues: getInitialValues(article, categories),
  });

  const currentStatus = useWatch({
    control: methods.control,
    name: "status",
  });

  const titleError = methods.formState.errors.title?.message;

  const mutation = useMutation({
    mutationFn: async (values: ArticleEditorValues) =>
      saveArticleAction(article?.id ?? null, buildArticleFormData(values)),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        void queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
        router.push("/admin/articles");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    },
  });

  const submitForm = methods.handleSubmit((values) => {
    if (!values.title.trim()) {
      methods.setError("title", { message: "Judul artikel wajib diisi." });
      return;
    }
    if (!values.body.trim()) {
      methods.setError("body", { message: "Isi konten artikel wajib diisi." });
      return;
    }
    mutation.mutate(values);
  });

  const titleSlot = (
    <div className="mb-6 border-b border-slate-100 pb-4">
      <input
        type="text"
        {...methods.register("title")}
        placeholder="Judul Artikel Tanpa Nama..."
        className="w-full bg-transparent text-2xl font-extrabold tracking-tight text-slate-900 outline-none placeholder:text-slate-300 sm:text-3xl"
      />
      {titleError ? (
        <p className="mt-1.5 text-xs font-medium text-rose-500">{titleError}</p>
      ) : null}
    </div>
  );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          void submitForm(e);
        }}
        className="space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/articles"
              className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <ArrowLeft className="size-3.5" />
              <span>Kembali</span>
            </Link>
            <StatusBadge status={currentStatus} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => {
                methods.setValue("status", "draft", { shouldDirty: true });
                void submitForm();
              }}
              className="h-9 gap-1.5 rounded-xl border-slate-200 px-3.5 text-xs font-semibold text-slate-700"
            >
              <Save className="size-3.5" />
              <span>Simpan Draft</span>
            </Button>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="h-9 gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-xs"
            >
              {mutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Send className="size-3.5" />
              )}
              <span>
                {article ? "Simpan Perubahan" : "Simpan Artikel"}
              </span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <FormRichText<ArticleEditorValues>
            name="body"
            topSlot={titleSlot}
            placeholder="Mulai ketik atau susun isi artikel Anda di sini..."
          />
          <ArticleEditorSidebar article={article} categories={categories} />
        </div>
      </form>
    </FormProvider>
  );
}
